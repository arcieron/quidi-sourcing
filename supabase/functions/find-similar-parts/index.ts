import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { targetPart } = await req.json();
    
    if (!targetPart) {
      return new Response(JSON.stringify({ error: 'Target part is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Finding similar parts for:', targetPart.material_number);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query for candidate parts with similar attributes
    let query = supabase.from('parts_data').select('*');
    
    // Exclude the target part
    if (targetPart.material_number) {
      query = query.neq('material_number', targetPart.material_number);
    }

    // Get parts from similar material group or basic material
    const orFilters = [];
    if (targetPart.material_group) {
      orFilters.push(`material_group.ilike.%${targetPart.material_group}%`);
    }
    if (targetPart.basic_material) {
      orFilters.push(`basic_material.ilike.%${targetPart.basic_material}%`);
    }
    if (targetPart.ext_material_group) {
      orFilters.push(`ext_material_group.ilike.%${targetPart.ext_material_group}%`);
    }
    
    if (orFilters.length > 0) {
      query = query.or(orFilters.join(','));
    }

    const { data: candidates, error: dbError } = await query.limit(20);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    if (!candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ similarParts: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${candidates.length} candidate parts`);

    // Use AI to analyze and rank similarity
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `You are an industrial parts matching expert. Analyze the target part and find the 2-3 most similar alternative parts from the candidates.

TARGET PART:
- Material Number: ${targetPart.material_number || 'N/A'}
- Description: ${targetPart.description || 'N/A'}
- Basic Material: ${targetPart.basic_material || 'N/A'}
- Material Group: ${targetPart.material_group || 'N/A'}
- Size/Dimension: ${targetPart.size_dimension || 'N/A'}
- Grade: ${targetPart.grade || 'N/A'}
- Vendor: ${targetPart.vendor_name || 'N/A'}

CANDIDATE PARTS:
${candidates.map((c, i) => `
${i + 1}. Material Number: ${c.material_number || 'N/A'}
   Description: ${c.description || 'N/A'}
   Basic Material: ${c.basic_material || 'N/A'}
   Material Group: ${c.material_group || 'N/A'}
   Size/Dimension: ${c.size_dimension || 'N/A'}
   Grade: ${c.grade || 'N/A'}
   Vendor: ${c.vendor_name || 'N/A'}
`).join('')}

Return a JSON array of the 2-3 most similar parts with this exact format:
[
  {
    "material_number": "the material number",
    "similarity_score": 85,
    "reason": "Brief explanation of why this is similar (e.g., 'Same material type and similar dimensions')"
  }
]

Only return the JSON array, no other text.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert at matching industrial parts. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '[]';
    
    console.log('AI response:', aiContent);

    // Parse AI response
    let similarMatches;
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      similarMatches = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      similarMatches = [];
    }

    // Map AI results back to full part data
    const similarParts = similarMatches
      .map((match: { material_number: string; similarity_score: number; reason: string }) => {
        const fullPart = candidates.find(c => c.material_number === match.material_number);
        if (fullPart) {
          return {
            ...fullPart,
            similarity_score: match.similarity_score,
            similarity_reason: match.reason,
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 3);

    console.log(`Returning ${similarParts.length} similar parts`);

    return new Response(JSON.stringify({ similarParts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in find-similar-parts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
