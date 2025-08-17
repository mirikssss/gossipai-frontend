#!/usr/bin/env node

const https = require('https');
const http = require('http');

const API_URL = 'https://web-production-f9f8.up.railway.app';
const API_ENDPOINTS = [
  '/api/v1/presets/',
  '/api/v1/history/',
  '/api/v1/auth/user'
];

function checkEndpoint(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500) // First 500 chars
        });
      });
    });
    
    req.on('error', (error) => {
      reject({ url, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({ url, error: 'Timeout' });
    });
  });
}

async function checkAPI() {
  console.log('🔍 Checking API endpoints...\n');
  
  for (const endpoint of API_ENDPOINTS) {
    const url = `${API_URL}${endpoint}`;
    console.log(`Testing: ${url}`);
    
    try {
      const result = await checkEndpoint(url);
      console.log(`✅ Status: ${result.status}`);
      console.log(`📄 Response: ${result.data.substring(0, 100)}...`);
      console.log(`🔗 Headers: ${JSON.stringify(result.headers, null, 2)}`);
    } catch (error) {
      console.log(`❌ Error: ${error.error}`);
    }
    console.log('---\n');
  }
  
  // Check CORS
  console.log('🔍 Checking CORS headers...');
  try {
    const result = await checkEndpoint(`${API_URL}/api/v1/presets/`);
    const corsHeader = result.headers['access-control-allow-origin'];
    console.log(`CORS Header: ${corsHeader || 'Not found'}`);
  } catch (error) {
    console.log(`CORS check failed: ${error.error}`);
  }
}

checkAPI().catch(console.error);
