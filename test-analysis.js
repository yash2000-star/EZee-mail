require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkEmails() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Define minimal schema to read the db
  const EmailAnalysisSchema = new mongoose.Schema({
    emailId: String,
    userEmail: String,
    summary: String,
    category: String,
  }, { collection: 'emailanalyses' });

  const EmailAnalysis = mongoose.model('EmailAnalysis', EmailAnalysisSchema);

  const total = await EmailAnalysis.countDocuments();
  console.log("Total analyses in DB:", total);

  const sample = await EmailAnalysis.find().limit(5);
  console.log("Sample documents:");
  sample.forEach(doc => {
    console.log(`- emailId: ${doc.emailId}, userEmail: ${doc.userEmail}, hasSummary: ${!!doc.summary}`);
  });

  mongoose.disconnect();
}

checkEmails().catch(console.error);
