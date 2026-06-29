const BAD_WORDS = [
  'fuck','shit','ass','bitch','cunt','dick','pussy','cock','bastard','damn','hell',
  'piss','crap','fag','faggot','dyke','nigger','nigga','chink','spic','kike',
  'wetback','cracker','honky','tranny','retard','retarded','whore','slut',
  'asshole','motherfucker','motherfucking','bullshit','jackass','dumbass',
  'dipshit','douchebag','prick','twat','wanker','tosser','bollocks','shithead',
  'fuckhead','fucker','fucked','fucking','fuckin','shitting','shitty',
]

// Build regex: word-boundary match, case-insensitive, leet-speak normalised
const LEET = { '0':'o','1':'i','3':'e','4':'a','5':'s','@':'a','$':'s','!':'i' }

function normalize(str) {
  return str.toLowerCase().replace(/[013456@$!]/g, c => LEET[c] ?? c)
}

export function containsProfanity(text) {
  if (!text) return false
  const norm = normalize(text)
  return BAD_WORDS.some(word => {
    const re = new RegExp(`(?<![a-z])${word}(?![a-z])`, 'i')
    return re.test(norm)
  })
}

export function profanityError(fields) {
  for (const [label, value] of Object.entries(fields)) {
    if (containsProfanity(value)) {
      return `Your ${label} contains inappropriate language. Please revise it.`
    }
  }
  return null
}
