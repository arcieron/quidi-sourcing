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
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Semantic search for:', query);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, get a broad set of candidates from the database
    const { data: allParts, error: dbError } = await supabase
      .from('parts_data')
      .select('*')
      .limit(500);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    if (!allParts || allParts.length === 0) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Retrieved ${allParts.length} parts for semantic analysis`);

    // Use AI to understand the query and find matching parts
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create a summary of available parts for the AI
    const partsSummary = allParts.slice(0, 100).map((p, i) => 
      `${i + 1}. [${p.material_number}] ${p.description || 'No description'} | Material: ${p.basic_material || p.material_group || 'N/A'} | Size: ${p.size_dimension || 'N/A'} | Vendor: ${p.vendor_name || 'N/A'}`
    ).join('\n');

    const prompt = `You are an industrial parts search expert. A user is searching for parts using natural language.

USER QUERY: "${query}"

AVAILABLE PARTS (showing first 100):
${partsSummary}

Based on the user's query, identify the 10-20 most relevant parts. Consider:
- Semantic meaning of the query (e.g., "fasteners" should match bolts, screws, nuts)
- Material requirements (e.g., "stainless" should match SS316, SS304, etc.)
- Size/dimension matches
- Use case context (e.g., "for piping" should match pipe fittings, flanges, etc.)

Return a JSON array of the matching part numbers in order of relevance:
["MAT001", "MAT002", ...]

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
          { role: 'system', content: 'You are an expert at understanding industrial parts queries. Always respond with valid JSON only.' },
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
    let matchingNumbers: string[];
    try {
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      matchingNumbers = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      matchingNumbers = [];
    }

    // Map back to full part data, maintaining AI's ranking order
    const results = matchingNumbers
      .map(num => allParts.find(p => p.material_number === num))
      .filter(Boolean)
      .slice(0, 100);

    // Remove duplicates
    const seen = new Set<string>();
    const uniqueResults = results.filter((item: any) => {
      if (!item.material_number || seen.has(item.material_number)) return false;
      seen.add(item.material_number);
      return true;
    });

    console.log(`Returning ${uniqueResults.length} semantic search results`);

    return new Response(JSON.stringify({ results: uniqueResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in semantic-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
