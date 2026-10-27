// n8n Custom Code Tool / Code Tool, JavaScript. Return a string.
return JSON.stringify({
 policy_version:'1.0-demo',
 supported_services:['boat trip enquiries','local food experience enquiries'],
 region:'Sardinia',
 availability:'unknown',prices:'unknown',booking_capability:false,
 required_details:['area','exact date including year','group size','service'],
 instructions:'Clarify missing details. Never invent partners, availability or prices. Unsupported requests, payments, booking confirmations and conflicting details require human review. All output is a draft.'
});
