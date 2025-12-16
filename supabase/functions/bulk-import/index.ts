import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ParsedRow {
  basicMaterial: string
  changedBy: string
  businessPartner: string
  organizationalUnit: string
  changedOn: string
  companyCreated: string
  createdBy: string
  createdOn: string
  description: string
  oldDescription: string
  extMatlGroup: string
  materialGroup: string
  materialType: string
  purchasingDocument: string
  purchaseDocItem: string
  purchasingOrg: string
  sizeDimension: string
  vendorCode: string
  vendorName: string
  materialNumber: string
  counterOfPO: number
  counterOfMaterial: number
  poValue: number
  poQuantity: string
}

function parseMarkdownRow(row: string): ParsedRow | null {
  const cells = row.split('|').slice(1, -1).map(c => c.trim())
  if (cells.length < 26 || cells[0] === 'Basic Material' || cells[0].startsWith('-')) {
    return null
  }
  
  // Parse PO Value - remove $ and commas
  let poValue = 0
  const poValueStr = cells[25]?.replace(/[$,]/g, '') || '0'
  poValue = parseFloat(poValueStr) || 0

  return {
    basicMaterial: cells[0] || '',
    changedBy: cells[1] || '',
    businessPartner: cells[2] || '',
    organizationalUnit: cells[3] || '',
    changedOn: cells[4] || '',
    companyCreated: cells[5] || '',
    createdBy: cells[6] || '',
    createdOn: cells[7] || '',
    description: cells[8] || '',
    oldDescription: cells[9] || '',
    extMatlGroup: cells[10] || '',
    materialGroup: cells[11] || '',
    materialType: cells[12] || '',
    purchasingDocument: cells[14] || '',
    purchaseDocItem: cells[15] || '',
    purchasingOrg: cells[16] || '',
    sizeDimension: cells[18] || '',
    vendorCode: cells[19] || '',
    vendorName: cells[20] || '',
    materialNumber: cells[21] || '',
    counterOfPO: parseInt(cells[22]) || 0,
    counterOfMaterial: parseInt(cells[23]) || 0,
    poValue: poValue,
    poQuantity: cells[26] || ''
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: markdownData } = await req.json()
    
    if (!markdownData) {
      return new Response(JSON.stringify({ error: 'No data provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Starting bulk import...')
    
    // Parse all rows
    const lines = markdownData.split('\n')
    const parsedRows: ParsedRow[] = []
    
    for (const line of lines) {
      if (line.startsWith('|')) {
        const parsed = parseMarkdownRow(line)
        if (parsed && parsed.materialNumber) {
          parsedRows.push(parsed)
        }
      }
    }

    console.log(`Parsed ${parsedRows.length} rows`)

    // Clear existing data
    console.log('Clearing existing data...')
    await supabase.from('vendor_price_history').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('purchase_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('material_vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('materials').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Extract unique vendors
    const vendorMap = new Map<string, { code: string, name: string }>()
    for (const row of parsedRows) {
      if (row.vendorCode && !vendorMap.has(row.vendorCode)) {
        vendorMap.set(row.vendorCode, { code: row.vendorCode, name: row.vendorName })
      }
    }

    console.log(`Found ${vendorMap.size} unique vendors`)

    // Insert vendors in batches
    const vendorEntries = Array.from(vendorMap.values())
    const vendorIdMap = new Map<string, string>()
    
    for (let i = 0; i < vendorEntries.length; i += 100) {
      const batch = vendorEntries.slice(i, i + 100).map(v => ({
        vendor_code: v.code,
        name: v.name || 'Unknown Vendor'
      }))
      
      const { data: insertedVendors, error: vendorError } = await supabase
        .from('vendors')
        .insert(batch)
        .select()
      
      if (vendorError) {
        console.error('Vendor insert error:', vendorError)
      } else if (insertedVendors) {
        for (const vendor of insertedVendors) {
          vendorIdMap.set(vendor.vendor_code, vendor.id)
        }
      }
    }

    console.log(`Inserted ${vendorIdMap.size} vendors`)

    // Extract unique materials
    const materialMap = new Map<string, ParsedRow>()
    for (const row of parsedRows) {
      if (row.materialNumber && !materialMap.has(row.materialNumber)) {
        materialMap.set(row.materialNumber, row)
      }
    }

    console.log(`Found ${materialMap.size} unique materials`)

    // Insert materials in batches
    const materialEntries = Array.from(materialMap.values())
    const materialIdMap = new Map<string, string>()
    
    for (let i = 0; i < materialEntries.length; i += 100) {
      const batch = materialEntries.slice(i, i + 100).map(m => ({
        material_number: m.materialNumber,
        basic_material: m.basicMaterial || null,
        description: m.description || null,
        old_description: m.oldDescription || null,
        material_group: m.materialGroup || null,
        material_type: m.materialType || null,
        ext_material_group: m.extMatlGroup || null,
        size_dimension: m.sizeDimension || null,
        created_by: m.createdBy || null,
        changed_by: m.changedBy || null,
        company_created: m.companyCreated || null,
        price: m.poValue || null,
        in_stock: Math.random() > 0.3, // Random stock status for demo
        quantity: Math.floor(Math.random() * 100) // Random quantity for demo
      }))
      
      const { data: insertedMaterials, error: materialError } = await supabase
        .from('materials')
        .insert(batch)
        .select()
      
      if (materialError) {
        console.error('Material insert error:', materialError)
      } else if (insertedMaterials) {
        for (const material of insertedMaterials) {
          materialIdMap.set(material.material_number, material.id)
        }
      }
    }

    console.log(`Inserted ${materialIdMap.size} materials`)

    // Insert purchase orders in batches
    let poCount = 0
    for (let i = 0; i < parsedRows.length; i += 100) {
      const batch = parsedRows.slice(i, i + 100)
        .filter(row => materialIdMap.has(row.materialNumber) && vendorIdMap.has(row.vendorCode))
        .map(row => ({
          material_id: materialIdMap.get(row.materialNumber),
          vendor_id: vendorIdMap.get(row.vendorCode),
          purchasing_document: row.purchasingDocument || null,
          purchase_doc_item: row.purchaseDocItem || null,
          purchasing_org: row.purchasingOrg || null,
          division: row.organizationalUnit || null,
          po_value: row.poValue || 0,
          po_quantity: parseInt(row.poQuantity) || 0,
          counter_of_po: row.counterOfPO || 0,
          counter_of_material: row.counterOfMaterial || 0
        }))
      
      if (batch.length > 0) {
        const { error: poError } = await supabase
          .from('purchase_orders')
          .insert(batch)
        
        if (poError) {
          console.error('PO insert error:', poError)
        } else {
          poCount += batch.length
        }
      }
    }

    console.log(`Inserted ${poCount} purchase orders`)

    // Insert material-vendor relationships
    const mvRelations = new Map<string, { materialId: string, vendorId: string, price: number }>()
    for (const row of parsedRows) {
      const materialId = materialIdMap.get(row.materialNumber)
      const vendorId = vendorIdMap.get(row.vendorCode)
      if (materialId && vendorId) {
        const key = `${materialId}-${vendorId}`
        if (!mvRelations.has(key)) {
          mvRelations.set(key, { materialId, vendorId, price: row.poValue })
        }
      }
    }

    let mvCount = 0
    const mvEntries = Array.from(mvRelations.values())
    for (let i = 0; i < mvEntries.length; i += 100) {
      const batch = mvEntries.slice(i, i + 100).map(mv => ({
        material_id: mv.materialId,
        vendor_id: mv.vendorId,
        current_price: mv.price
      }))
      
      const { error: mvError } = await supabase
        .from('material_vendors')
        .insert(batch)
      
      if (mvError) {
        console.error('Material-vendor insert error:', mvError)
      } else {
        mvCount += batch.length
      }
    }

    console.log(`Inserted ${mvCount} material-vendor relationships`)

    return new Response(JSON.stringify({
      success: true,
      stats: {
        totalRows: parsedRows.length,
        vendors: vendorIdMap.size,
        materials: materialIdMap.size,
        purchaseOrders: poCount,
        materialVendors: mvCount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: unknown) {
    console.error('Import error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
