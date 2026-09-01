/**
 * UGC NET Subject Selector & Helpers Module
 * Official 83 UGC NET Subjects Database & Interactive Selector
 */

const UGC_NET_SUBJECTS = [
  { code: "01", name: "Economics / Rural Economics", group: "Humanities & Social Sciences" },
  { code: "02", name: "Political Science", group: "Humanities & Social Sciences" },
  { code: "03", name: "Philosophy", group: "Humanities & Social Sciences" },
  { code: "04", name: "Psychology", group: "Humanities & Social Sciences" },
  { code: "05", name: "Sociology", group: "Humanities & Social Sciences" },
  { code: "06", name: "History", group: "Humanities & Social Sciences" },
  { code: "07", name: "Anthropology", group: "Humanities & Social Sciences" },
  { code: "08", name: "Commerce", group: "Humanities & Social Sciences" },
  { code: "09", name: "Education", group: "Humanities & Social Sciences" },
  { code: "10", name: "Social Work", group: "Humanities & Social Sciences" },
  { code: "11", name: "Defence and Strategic Studies", group: "Humanities & Social Sciences" },
  { code: "12", name: "Home Science", group: "Humanities & Social Sciences" },
  { code: "14", name: "Public Administration", group: "Humanities & Social Sciences" },
  { code: "15", name: "Population Studies", group: "Humanities & Social Sciences" },
  { code: "16", name: "Music", group: "Humanities & Social Sciences" },
  { code: "17", name: "Management", group: "Humanities & Social Sciences" },
  { code: "18", name: "Women Studies", group: "Humanities & Social Sciences" },
  { code: "19", name: "Yoga", group: "Humanities & Social Sciences" },
  { code: "20", name: "Adult Education/Continuing Education/Andragogy", group: "Humanities & Social Sciences" },
  { code: "21", name: "Physical Education", group: "Humanities & Social Sciences" },
  { code: "22", name: "Library and Information Science", group: "Humanities & Social Sciences" },
  { code: "23", name: "Journalism and Mass Communication", group: "Humanities & Social Sciences" },
  { code: "24", name: "Social Medicine and Community Health", group: "Humanities & Social Sciences" },
  { code: "25", name: "Forensic Science", group: "Humanities & Social Sciences" },
  { code: "26", name: "Pali", group: "Languages" },
  { code: "27", name: "Prakrit", group: "Languages" },
  { code: "28", name: "Sanskrit", group: "Languages" },
  { code: "29", name: "Arabic", group: "Languages" },
  { code: "30", name: "Persian", group: "Languages" },
  { code: "31", name: "French", group: "Languages" },
  { code: "32", name: "German", group: "Languages" },
  { code: "33", name: "Russian", group: "Languages" },
  { code: "34", name: "Spanish", group: "Languages" },
  { code: "35", name: "Chinese", group: "Languages" },
  { code: "36", name: "Japanese", group: "Languages" },
  { code: "37", name: "Korean", group: "Languages" },
  { code: "38", name: "Hindi", group: "Languages" },
  { code: "39", name: "English", group: "Languages" },
  { code: "40", name: "Urdu", group: "Languages" },
  { code: "41", name: "Punjabi", group: "Languages" },
  { code: "42", name: "Bengali", group: "Languages" },
  { code: "43", name: "Oriya", group: "Languages" },
  { code: "44", name: "Gujarati", group: "Languages" },
  { code: "45", name: "Marathi", group: "Languages" },
  { code: "46", name: "Tamil", group: "Languages" },
  { code: "47", name: "Telugu", group: "Languages" },
  { code: "48", name: "Kannada", group: "Languages" },
  { code: "49", name: "Malayalam", group: "Languages" },
  { code: "50", name: "Assamese", group: "Languages" },
  { code: "51", name: "Manipuri", group: "Languages" },
  { code: "52", name: "Bodo", group: "Languages" },
  { code: "53", name: "Santhali", group: "Languages" },
  { code: "54", name: "Comparative Literature", group: "Humanities & Social Sciences" },
  { code: "55", name: "Linguistics", group: "Humanities & Social Sciences" },
  { code: "56", name: "Folklore", group: "Humanities & Social Sciences" },
  { code: "57", name: "Tribal Studies", group: "Humanities & Social Sciences" },
  { code: "58", name: "Dalit Studies", group: "Humanities & Social Sciences" },
  { code: "59", name: "Chemical Sciences", group: "Sciences" },
  { code: "60", name: "Earth Sciences", group: "Sciences" },
  { code: "61", name: "Life Sciences", group: "Sciences" },
  { code: "62", name: "Mathematical Sciences", group: "Sciences" },
  { code: "63", name: "Physical Sciences", group: "Sciences" },
  { code: "64", name: "Environmental Sciences", group: "Sciences" },
  { code: "65", name: "Computer Science and Applications", group: "Sciences" },
  { code: "66", name: "Electronic Science", group: "Sciences" },
  { code: "67", name: "Geography", group: "Sciences" },
  { code: "68", name: "Geology", group: "Sciences" },
  { code: "69", name: "Geophysics", group: "Sciences" },
  { code: "70", name: "Botany", group: "Sciences" },
  { code: "71", name: "Zoology", group: "Sciences" },
  { code: "72", name: "Biochemistry", group: "Sciences" },
  { code: "73", name: "Biotechnology", group: "Sciences" },
  { code: "74", name: "Microbiology", group: "Sciences" },
  { code: "75", name: "Molecular Biology", group: "Sciences" },
  { code: "76", name: "Genetics", group: "Sciences" },
  { code: "77", name: "Plant Physiology", group: "Sciences" },
  { code: "78", name: "Animal Physiology", group: "Sciences" },
  { code: "79", name: "Ecology", group: "Sciences" },
  { code: "80", name: "Agriculture", group: "Sciences" },
  { code: "81", name: "Veterinary Science", group: "Sciences" },
  { code: "82", name: "Fisheries", group: "Sciences" },
  { code: "83", name: "Food Science and Technology", group: "Sciences" },
  { code: "84", name: "Home Science (Food & Nutrition)", group: "Sciences" }
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
      s.group.toLowerCase().includes(q)
    );
  }

  return {
    getSubjects,
    filterSubjects
  };
})();

if (typeof module !== 'undefined') {
  module.exports = { UGC_NET_SUBJECTS, UGCNet };
}
