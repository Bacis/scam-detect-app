export const createInstruction = (promptText: string): string => {
  return `Analyze the following YouTube short transcript: ${promptText}. 
    Provide the response in JSON format with a scam rating in a decimal value, where 1 is an absolute scam and closer to 0 is legitimate. 
    Also, I want you to structure the response in a way that is easy to parse and extract the keys: scam_rating, phrases_intents, and explanation.`;
};

export const initialPrompts = [
  {
    role: 'system',
    content: 'You are a scam detection assistant that analyzes YouTube short transcripts for potential scams.',
  },
  { role: 'user', content: 'Analyze the following transcript: "Invest now and double your money!"' },
  {
    role: 'assistant',
    content:
      'This transcript contains a clear intent to promote financial transactions. It is likely a scam. { "scam_rating": 0.9, "phrases_intents": ["Invest now", "double your money"], "explanation": "The phrase encourages immediate investment with unrealistic returns." }',
  },

  { role: 'user', content: 'Analyze the following transcript: "Join our fun community and learn how to make money!"' },
  {
    role: 'assistant',
    content:
      'This transcript suggests a potential scam as it implies financial gain without clear details. { "scam_rating": 0.7, "phrases_intents": ["make money"], "explanation": "The phrase is vague and could be misleading." }',
  },

  { role: 'user', content: 'Analyze the following transcript: "This is just a joke, don\'t take it seriously!"' },
  {
    role: 'assistant',
    content:
      'This transcript does not indicate a scam as it is framed as humor. { "scam_rating": 0.1, "phrases_intents": [], "explanation": "The context suggests satire rather than a serious financial proposition." }',
  },

  { role: 'user', content: 'Analyze the following transcript: "You must act fast to secure your investment!"' },
  {
    role: 'assistant',
    content:
      'This transcript contains a sense of urgency that is often associated with scams. { "scam_rating": 0.85, "phrases_intents": ["act fast", "secure your investment"], "explanation": "The urgency suggests pressure tactics commonly used in scams." }',
  },

  { role: 'user', content: 'Analyze the following transcript: "We are not responsible for any losses."' },
  {
    role: 'assistant',
    content:
      'This transcript raises red flags as it disclaims responsibility. { "scam_rating": 0.8, "phrases_intents": ["not responsible for losses"], "explanation": "This phrase indicates a lack of accountability, which is common in scams." }',
  },

  { role: 'user', content: 'Analyze the following transcript: "This is a legitimate investment opportunity."' },
  {
    role: 'assistant',
    content:
      'This transcript requires further analysis as it claims legitimacy. { "scam_rating": 0.5, "phrases_intents": ["legitimate investment opportunity"], "explanation": "The phrase is ambiguous and needs context to determine legitimacy." }',
  },

  {
    role: 'user',
    content:
      'Analyze the following transcript: "what&amp;#39;s up guys welcome back to the channel today&amp;#39;s topic is how high can the Dogecoin price really actually go on this cycle and that&amp;#39;s the question on every Doge holder&amp;#39;s mind right now is where should I think about at least selling some and I can&amp;#39;t give you guys Financial advice but I can tell you what I&amp;#39;m going to do I personally I&amp;#39;ve looked at the charts dogecoins previous all-time high market cap was 90 billion in May early May of 2021 so on this cycle I&amp;#39;m predicting for myself that the Dogecoin market cap could go up to 500 billion do and I know some of you are sitting there thinking there&amp;#39;s no way that&amp;#39;s not even possible but on the last cycle Dogecoin went to 90 billion and on the previous cycle it was like 1 billion so anything is possible at like 90x this previous alltime High I&amp;#39;m expecting that it five or six X&amp;#39;s its previous all-time high and that&amp;#39;s where I&amp;#39;m going to take some profits good luck"',
  },
  {
    role: 'assistant',
    content:
      'Even though this transcript does promote a crypto asset doge coin, it does not ask the user to send any money to their project wallets for a higher return. It is less likely to be a scam. { "scam_rating": 0.1, "phrases_intents": ["doge coin", "previous cycle"], "explanation": "The talker encourages investment in doge coin, but does not encourage to send any money to him." }',
  },

  {
    role: 'user',
    content:
      'Analyze the following transcript: "Hello I am Elon Musk and to celebrate the success of my companies I would like to return to the community to offer a giveaway. The only thing you have to do is send crypto to this address and I will return three times for the amount."',
  },
  {
    role: 'assistant',
    content:
      'This transcript impersonates Elon Musk and he is suggesting to lure out user money in return of multiplying the amount. This is a common giveaway scam and should be avoided immediately reported. { "scam_rating": 1, "phrases_intents": ["Elon Musk giveaway", "double your money", "send crypto to this address"], "explanation": "Phrases offer public giveaways from famous celebrities that require to send crypto to another person, in this case Elon Musk himself." }',
  },

  {
    role: 'user',
    content:
      'Analyze the following transcript: "Hi, I am Michael Saylor, and I am thrilled to announce the success of MicroStrategy and our Bitcoin investments. To celebrate, I am offering a public giveaway. All you need to do is send your crypto to my address, and I will send back double the amount."',
  },
  {
    role: 'assistant',
    content:
      'This transcript impersonates Michael Saylor and suggests sending crypto to receive double in return. This is a typical giveaway scam and should be avoided and reported. { "scam_rating": 1, "phrases_intents": ["Michael Saylor giveaway", "send crypto to my address", "double the amount"], "explanation": "The transcript uses the name of a well-known figure to promote a giveaway that requires sending crypto, which is a common scam tactic." }',
  },

  {
    role: 'user',
    content:
      'Analyze the following transcript: "I see an SUV I got four armed men they&amp;#39;re in gear El stay on that 50 I got him down Put the gun down now back mother put up your hands get down mother put your gun down now put your gun down advance advance [Music] hands high pistol off your hip now what do you want me to do keep my hands up or take off the pistol keep your hands up okay easy easy can I touch mying head now slowly we&amp;#39;re on the same side guys you guys are wiing tight you know that now what are you guys doing here we have a flat tire can you help us"',
  },
  {
    role: 'assistant',
    content:
      'This is not a scam as there is no indication of offering a financial reward on participating on a specific programme. { "scam_rating": 0, "phrases_intents": [], "explanation": "The scenario does not involve any financial transaction or promise of reward." }',
  },

  {
    role: 'user',
    content:
      'Analyze the following transcript: "we have found a witch may we burner how do you know she is a witch she looks like bring her forward I&amp;#39;m not a witch I&amp;#39;m not a witch but you are just as one they dressed me up like this and this isn&amp;#39;t my nose it&amp;#39;s a false one will well we did do the nose the nose and the hat but is a witch did you dress her up like this no yes yes a bit a bit she has got a wart what makes you think she is a witch well she turned me into a n a n i got better burner any"',
  },
  {
    role: 'assistant',
    content:
      'This transcript contains content related to witches, which usually indicates fantasy content that has nothing to do with financial schemes. Therefore, it is not a scam. { "scam_rating": 0, "phrases_intents": ["witch", "burner"], "explanation": "The content is related to fantasy and does not involve any financial transaction or promise of reward." }',
  },
];
