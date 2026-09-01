/**
 * UGC NET Official Subject Database (Subject Codes 00 to 107)
 * Based on National Testing Agency (NTA) & UGC Official Catalog
 */

const UGC_NET_SUBJECTS = [
  { code: "00", name: "General Paper on Teaching & Research Aptitude (Paper-I)", group: "Compulsory General Paper" },
  { code: "01", name: "Economics / Rural Economics / Co-operation / Demography / Development Planning / Econometrics", group: "Social Sciences" },
  { code: "02", name: "Political Science", group: "Social Sciences" },
  { code: "03", name: "Philosophy", group: "Humanities" },
  { code: "04", name: "Psychology", group: "Social Sciences" },
  { code: "05", name: "Sociology", group: "Social Sciences" },
  { code: "06", name: "History", group: "Humanities" },
  { code: "07", name: "Anthropology", group: "Social Sciences" },
  { code: "08", name: "Commerce", group: "Commerce & Management" },
  { code: "09", name: "Education", group: "Education" },
  { code: "10", name: "Social Work", group: "Social Sciences" },
  { code: "11", name: "Defence and Strategic Studies", group: "Social Sciences" },
  { code: "12", name: "Home Science", group: "Interdisciplinary" },
  { code: "14", name: "Public Administration", group: "Social Sciences" },
  { code: "15", name: "Population Studies", group: "Social Sciences" },
  { code: "16", name: "Music", group: "Performing Arts" },
  { code: "17", name: "Management (Marketing / HR / Finance / Co-operative)", group: "Commerce & Management" },
  { code: "18", name: "Maithili", group: "Languages" },
  { code: "19", name: "Bengali", group: "Languages" },
  { code: "20", name: "Hindi", group: "Languages" },
  { code: "21", name: "Kannada", group: "Languages" },
  { code: "22", name: "Malayalam", group: "Languages" },
  { code: "23", name: "Oriya", group: "Languages" },
  { code: "24", name: "Punjabi", group: "Languages" },
  { code: "25", name: "Sanskrit", group: "Languages" },
  { code: "26", name: "Tamil", group: "Languages" },
  { code: "27", name: "Telugu", group: "Languages" },
  { code: "28", name: "Urdu", group: "Languages" },
  { code: "29", name: "Arabic", group: "Languages" },
  { code: "30", name: "English", group: "Languages" },
  { code: "31", name: "Linguistics", group: "Humanities" },
  { code: "32", name: "Chinese", group: "Languages" },
  { code: "33", name: "Dogri", group: "Languages" },
  { code: "34", name: "Nepali", group: "Languages" },
  { code: "35", name: "Manipuri", group: "Languages" },
  { code: "36", name: "Assamese", group: "Languages" },
  { code: "37", name: "Gujarati", group: "Languages" },
  { code: "38", name: "Marathi", group: "Languages" },
  { code: "39", name: "French", group: "Languages" },
  { code: "40", name: "Spanish", group: "Languages" },
  { code: "41", name: "Russian", group: "Languages" },
  { code: "42", name: "Persian", group: "Languages" },
  { code: "43", name: "Rajasthani", group: "Languages" },
  { code: "44", name: "German", group: "Languages" },
  { code: "45", name: "Japanese", group: "Languages" },
  { code: "46", name: "Adult Education / Continuing Education / Andragogy / Non Formal Education", group: "Education" },
  { code: "47", name: "Physical Education", group: "Education" },
  { code: "49", name: "Arab Culture and Islamic Studies", group: "Humanities" },
  { code: "50", name: "Indian Culture", group: "Humanities" },
  { code: "55", name: "Labour Welfare / Personnel Management / Industrial Relations / HRM", group: "Commerce & Management" },
  { code: "58", name: "Law", group: "Law" },
  { code: "59", name: "Library and Information Science", group: "Interdisciplinary" },
  { code: "60", name: "Buddhist, Jaina, Gandhian and Peace Studies", group: "Humanities" },
  { code: "62", name: "Comparative Study of Religions", group: "Humanities" },
  { code: "63", name: "Mass Communication and Journalism", group: "Media & Journalism" },
  { code: "65", name: "Performing Art - Dance / Drama / Theatre", group: "Performing Arts" },
  { code: "66", name: "Museology & Conservation", group: "Humanities" },
  { code: "67", name: "Archaeology", group: "Humanities" },
  { code: "68", name: "Criminology", group: "Social Sciences" },
  { code: "70", name: "Tribal and Regional Language / Literature", group: "Languages" },
  { code: "71", name: "Folk Literature", group: "Humanities" },
  { code: "72", name: "Comparative Literature", group: "Humanities" },
  { code: "73", name: "Sanskrit Traditional Subjects (Jyotisha / Vyakarna / Mimansa / Sahitya)", group: "Languages" },
  { code: "74", name: "Women Studies", group: "Interdisciplinary" },
  { code: "79", name: "Visual Art (Drawing & Painting / Sculpture / Graphics / History of Art)", group: "Fine Arts" },
  { code: "80", name: "Geography", group: "Sciences & Social Sciences" },
  { code: "81", name: "Social Medicine & Community Health", group: "Medical Sciences" },
  { code: "82", name: "Forensic Science", group: "Sciences" },
  { code: "83", name: "Pali", group: "Languages" },
  { code: "84", name: "Kashmiri", group: "Languages" },
  { code: "85", name: "Konkani", group: "Languages" },
  { code: "87", name: "Computer Science and Applications", group: "Computer Science" },
  { code: "88", name: "Electronic Science", group: "Engineering Sciences" },
  { code: "89", name: "Environmental Sciences", group: "Environmental Sciences" },
  { code: "90", name: "Politics including International Relations / International Studies", group: "Social Sciences" },
  { code: "91", name: "Prakrit", group: "Languages" },
  { code: "92", name: "Human Rights and Duties", group: "Law & Social Sciences" },
  { code: "93", name: "Tourism Administration and Management", group: "Commerce & Management" },
  { code: "94", name: "Bodo", group: "Languages" },
  { code: "95", name: "Santali", group: "Languages" },
  { code: "100", name: "Yoga", group: "Interdisciplinary" },
  { code: "101", name: "Sindhi", group: "Languages" },
  { code: "102", name: "Hindu Studies", group: "Humanities" },
  { code: "103", name: "Indian Knowledge System", group: "Interdisciplinary" },
  { code: "104", name: "Disaster Management", group: "Interdisciplinary" },
  { code: "105", name: "Ayurveda Biology", group: "Medical Sciences" },
  { code: "106", name: "Forestry", group: "Agricultural Sciences" },
  { code: "107", name: "Statistics", group: "Mathematical Sciences" }
];

const UGCNet = (function() {
  function getSubjects() {
    return UGC_NET_SUBJECTS;
  }

  function filterSubjects(query = '') {
    const q = query.toLowerCase().trim();
    if (!q) return UGC_NET_SUBJECTS;
    return UGC_NET_SUBJECTS.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.includes(q) || 
      `code ${s.code}`.includes(q) ||
      s.group.toLowerCase().includes(q)
    );
  }

  function getSubjectByCode(code) {
    return UGC_NET_SUBJECTS.find(s => s.code === code) || null;
  }

  return {
    getSubjects,
    filterSubjects,
    getSubjectByCode
  };
})();

if (typeof module !== 'undefined') {
  module.exports = { UGC_NET_SUBJECTS, UGCNet };
}
