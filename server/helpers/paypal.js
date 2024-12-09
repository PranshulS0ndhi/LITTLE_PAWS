// const paypal= require('@paypal/paypal-server-sdk')

// paypal.configure({
//     mode: "sandbox",
//     client_id: "AUjOsNRbZfwgKkU6eoEimZ93kxlpxjdy0x5cQcGbqWRUof_3VvG_5WjIWE8aWLnOTDXaiq9fh4d0_uuW",
//     client_secret: "EIKAe3MJDYm4O84_QO35x3At9pF4siQ8myuR_v_D7JlgES9YoW8znEXtyaS1OYbGg0qIzwe1fWVt8Sk1",
// });
  
// module.exports = paypal;


// // Configure the PayPal client
// const client = new Client({
//   clientCredentialsAuthCredentials: {
//     oAuthClientId: "AUjOsNRbZfwgKkU6eoEimZ93kxlpxjdy0x5cQcGbqWRUof_3VvG_5WjIWE8aWLnOTDXaiq9fh4d0_uuW", // Replace with your PayPal Client ID
//     oAuthClientSecret: "EIKAe3MJDYm4O84_QO35x3At9pF4siQ8myuR_v_D7JlgES9YoW8znEXtyaS1OYbGg0qIzwe1fWVt8Sk1", // Replace with your PayPal Client Secret
//   },
//   timeout: 0, // Optional: 0 for no timeout
//   environment: Environment.Sandbox, // Use Environment.Live for production
//   logging: {
//     logLevel: LogLevel.Info, // Options: Error, Warn, Info, Debug
//     logRequest: {
//       logBody: true, // Logs request body
//     },
//     logResponse: {
//       logHeaders: true, // Logs response headers
//     },
//   },
// });

// module.exports = client;



// const paypal = require('@paypal/paypal-server-sdk');

// // Configure the PayPal client
// const client = new paypal.core.PayPalHttpClient(
//   new paypal.core.SandboxEnvironment(
//     process.env.PAYPAL_CLIENT_ID, 
//     process.env.PAYPAL_CLIENT_SECRET
//   )
// );

// module.exports = client;



// Configure the PayPal client
const { Client, Environment, LogLevel } = require('@paypal/paypal-server-sdk');
const client = new Client({
  clientId:"AUjOsNRbZfwgKkU6eoEimZ93kxlpxjdy0x5cQcGbqWRUof_3VvG_5WjIWE8aWLnOTDXaiq9fh4d0_uuW",
  clientSecret: "EIKAe3MJDYm4O84_QO35x3At9pF4siQ8myuR_v_D7JlgES9YoW8znEXtyaS1OYbGg0qIzwe1fWVt8Sk1",
  environment: Environment.Sandbox  // Use Environment.Live for production
});

module.exports = client;
