#!/usr/bin/env node
/**
 * MOCKHARD — Question Bank Generator
 * ===================================
 * Generates question JSON files for all 10 categories × 5 levels.
 * 
 * Usage:
 *   node tools/generate-questions.js
 *   node tools/generate-questions.js --category upsc --level C
 *   node tools/generate-questions.js --validate
 */

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────
const CATEGORIES = [
  'upsc', 'state-psc', 'ssc', 'railways', 'neet', 'jee', 'cuet', 'gate',
  'norcet', 'clat', 'board', 'defence', 'banking', 'police-state', 'foundation', 'teaching-net'
];
const LEVELS = ['C', 'B', 'A', 'Aplus', 'Aplusplus'];
const LEVEL_LABELS = { C: 'C', B: 'B', A: 'A', Aplus: 'A+', Aplusplus: 'A++' };
const TARGET_PER_LEVEL = 200;
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'questions');
const MANIFEST_PATH = path.join(__dirname, '..', 'data', 'manifest.json');

// ─────────────────────────────────────────
// SEEDED RANDOM (deterministic generation)
// ─────────────────────────────────────────
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// ─────────────────────────────────────────
// QUESTION BANK DEFINITIONS PER CATEGORY
// ─────────────────────────────────────────

const QUESTION_BANKS = {

// ═══════════════════════════════════════════
// UPSC
// ═══════════════════════════════════════════
upsc: {
  subjects: ['Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science'],
  questionSets: {
    Polity: {
      C: [
        { q: "The Constitution of India was adopted on:", o: ["26 November 1949", "26 January 1950", "15 August 1947", "2 October 1950"], c: 0, e: "The Constitution was adopted on 26 November 1949 and came into effect on 26 January 1950." },
        { q: "Who is known as the 'Father of the Indian Constitution'?", o: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Rajendra Prasad"], c: 1, e: "Dr. B.R. Ambedkar chaired the Drafting Committee and is regarded as the Father of the Indian Constitution." },
        { q: "Which Article of the Indian Constitution abolishes 'Untouchability'?", o: ["Article 14", "Article 15", "Article 17", "Article 19"], c: 2, e: "Article 17 abolishes untouchability and forbids its practice in any form." },
        { q: "The Panchayati Raj system was constitutionalized through which Amendment?", o: ["42nd Amendment", "44th Amendment", "73rd Amendment", "74th Amendment"], c: 2, e: "The 73rd Constitutional Amendment Act (1992) gave constitutional status to Panchayati Raj institutions." },
        { q: "Which among the following is NOT a Fundamental Right?", o: ["Right to Equality", "Right to Property", "Right to Freedom", "Right against Exploitation"], c: 1, e: "Right to Property was removed from Fundamental Rights by the 44th Amendment (1978) and made a legal right under Article 300A." },
        { q: "The Indian Parliament consists of how many houses?", o: ["One", "Two", "Three", "Four"], c: 1, e: "The Indian Parliament is bicameral, consisting of Rajya Sabha and Lok Sabha." },
        { q: "Which schedule of the Indian Constitution deals with anti-defection law?", o: ["Eighth Schedule", "Ninth Schedule", "Tenth Schedule", "Eleventh Schedule"], c: 2, e: "The Tenth Schedule, added by the 52nd Amendment Act (1985), contains anti-defection provisions." },
        { q: "The Finance Commission is constituted under which Article?", o: ["Article 268", "Article 275", "Article 280", "Article 300"], c: 2, e: "Article 280 provides for the constitution of the Finance Commission every five years." },
        { q: "The concept of 'Judicial Review' in India is taken from which country's constitution?", o: ["UK", "USA", "France", "Germany"], c: 1, e: "The concept of Judicial Review has been borrowed from the Constitution of the United States." },
        { q: "Which writ is issued for personal liberty?", o: ["Mandamus", "Certiorari", "Habeas Corpus", "Quo Warranto"], c: 2, e: "Habeas Corpus protects personal liberty against unlawful detention." },
        { q: "Directive Principles of State Policy are contained in which Part of the Constitution?", o: ["Part III", "Part IV", "Part IVA", "Part V"], c: 1, e: "Part IV (Articles 36-51) contains the Directive Principles of State Policy." },
        { q: "Which committee recommended the 'Three-tier Panchayati Raj' system?", o: ["Sarkaria Commission", "Balwant Rai Mehta Committee", "Ashok Mehta Committee", "L.M. Singhvi Committee"], c: 1, e: "The Balwant Rai Mehta Committee (1957) recommended the three-tier Panchayati Raj system." },
        { q: "The CAG of India is appointed under which Article?", o: ["Article 148", "Article 155", "Article 165", "Article 280"], c: 0, e: "Article 148 deals with the appointment and conditions of service of the CAG." },
        { q: "The Inter-State Council is established under which Article?", o: ["Article 260", "Article 263", "Article 280", "Article 300"], c: 1, e: "Article 263 provides for establishment of an Inter-State Council." },
        { q: "Who was the first President of India?", o: ["Dr. Rajendra Prasad", "Jawaharlal Nehru", "Sardar Patel", "B.R. Ambedkar"], c: 0, e: "Dr. Rajendra Prasad served as the first President of India from 1950 to 1962." },
        { q: "The President of India is elected by:", o: ["Direct election by citizens", "Members of Parliament only", "Electoral college of elected MPs and MLAs", "Rajya Sabha members only"], c: 2, e: "The President is elected by an electoral college consisting of elected members of both Houses of Parliament and State Legislative Assemblies." },
        { q: "Which constitutional body conducts elections in India?", o: ["Supreme Court", "UPSC", "Election Commission", "Finance Commission"], c: 2, e: "The Election Commission of India, established under Article 324, conducts all elections." },
        { q: "The original Constitution of India had how many Articles?", o: ["295", "395", "445", "448"], c: 1, e: "The original Constitution had 395 Articles in 22 Parts and 8 Schedules." },
        { q: "Which part of the Constitution deals with Fundamental Duties?", o: ["Part III", "Part IV", "Part IVA", "Part V"], c: 2, e: "Part IVA (Article 51A) contains the Fundamental Duties, added by the 42nd Amendment." },
        { q: "The power to amend the Constitution is given under:", o: ["Article 356", "Article 368", "Article 370", "Article 352"], c: 1, e: "Article 368 grants Parliament the power to amend the Constitution." },
        { q: "What is the minimum age to become a member of Rajya Sabha?", o: ["25 years", "30 years", "35 years", "21 years"], c: 1, e: "A person must be at least 30 years of age to become a member of Rajya Sabha." },
        { q: "The Preamble of the Indian Constitution declares India as a:", o: ["Sovereign, Socialist, Secular, Democratic Republic", "Federal Democratic Republic", "Parliamentary Democracy", "Constitutional Monarchy"], c: 0, e: "The Preamble declares India as a Sovereign, Socialist, Secular, Democratic Republic." },
        { q: "How many Fundamental Rights are currently recognized in the Constitution?", o: ["7", "6", "5", "8"], c: 1, e: "There are currently 6 Fundamental Rights (Right to Property was removed by the 44th Amendment)." },
        { q: "Who appoints the Governor of a State?", o: ["Chief Minister", "President of India", "Prime Minister", "Chief Justice of India"], c: 1, e: "The Governor is appointed by the President of India under Article 155." },
        { q: "The concept of 'Rule of Law' is borrowed from:", o: ["USA", "UK", "France", "Canada"], c: 1, e: "The concept of Rule of Law is borrowed from the British/English legal system." },
        { q: "Right to Education was added as a Fundamental Right by which Amendment?", o: ["86th Amendment", "91st Amendment", "92nd Amendment", "93rd Amendment"], c: 0, e: "The 86th Amendment Act (2002) added Article 21A making education a fundamental right for children aged 6-14." },
        { q: "The maximum strength of Lok Sabha is:", o: ["545", "552", "530", "500"], c: 1, e: "The maximum strength of Lok Sabha is 552 members (530 from states + 20 from UTs + 2 nominated)." },
        { q: "Which Schedule contains provisions for allocation of seats in Rajya Sabha?", o: ["Third Schedule", "Fourth Schedule", "Fifth Schedule", "Sixth Schedule"], c: 1, e: "The Fourth Schedule contains provisions for allocation of seats in the Rajya Sabha to states and union territories." },
        { q: "Emergency provisions are contained in which Part?", o: ["Part XVI", "Part XVII", "Part XVIII", "Part XIX"], c: 2, e: "Part XVIII (Articles 352-360) deals with Emergency Provisions." },
        { q: "Joint sitting of both Houses of Parliament is called by:", o: ["Speaker of Lok Sabha", "President of India", "Vice President", "Prime Minister"], c: 1, e: "The President can summon a joint sitting of both Houses under Article 108." },
        { q: "Who presides over the joint sitting of Parliament?", o: ["Vice President", "President", "Speaker of Lok Sabha", "Leader of Opposition"], c: 2, e: "The Speaker of the Lok Sabha presides over joint sittings of both Houses." },
        { q: "The term 'Secular' was added to the Preamble by which Amendment?", o: ["42nd Amendment", "44th Amendment", "73rd Amendment", "86th Amendment"], c: 0, e: "The 42nd Amendment (1976) added the words 'Socialist' and 'Secular' to the Preamble." },
        { q: "Money Bills can only be introduced in:", o: ["Rajya Sabha", "Lok Sabha", "Either House", "Joint Session"], c: 1, e: "Under Article 110, Money Bills can only be introduced in Lok Sabha." },
        { q: "Which body resolves disputes regarding the election of the President?", o: ["Parliament", "Election Commission", "Supreme Court", "High Court"], c: 2, e: "Under Article 71, disputes regarding the election of the President are decided by the Supreme Court." },
      ],
      B: [
        { q: "Consider the following statements about the Attorney General of India:\n1. He is appointed by the President.\n2. He must have qualifications to be a Supreme Court judge.\n3. He has the right to vote in Parliament.\nWhich of the above is/are correct?", o: ["1 and 2 only", "1 only", "2 and 3 only", "1, 2 and 3"], c: 0, e: "The Attorney General is appointed by the President (Art. 76) and must be qualified to be a SC judge. He can participate in Parliamentary proceedings but has no right to vote." },
        { q: "The 'Doctrine of Basic Structure' was propounded in which case?", o: ["Golaknath case", "Kesavananda Bharati case", "Minerva Mills case", "Maneka Gandhi case"], c: 1, e: "The Supreme Court propounded the Basic Structure doctrine in Kesavananda Bharati v. State of Kerala (1973)." },
        { q: "Which of the following is NOT a feature of Indian federalism?", o: ["Written Constitution", "Dual citizenship", "Division of powers", "Independent judiciary"], c: 1, e: "India has single citizenship, unlike the USA which has dual citizenship. This is a unitary feature." },
        { q: "Consider the following about the Comptroller and Auditor General:\n1. CAG audits the accounts of both Union and States.\n2. CAG can be removed only by impeachment.\n3. CAG is eligible for reappointment.\nWhich is/are correct?", o: ["1 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], c: 0, e: "CAG audits Union and State accounts. CAG is removed like a Supreme Court judge (not technically impeachment). CAG is NOT eligible for further office under the Government." },
        { q: "The concept of 'Concurrent List' is borrowed from which country?", o: ["USA", "Australia", "Canada", "South Africa"], c: 1, e: "The Concurrent List is borrowed from the Australian Constitution." },
        { q: "Which Article deals with the abolition of titles?", o: ["Article 15", "Article 16", "Article 17", "Article 18"], c: 3, e: "Article 18 prohibits the State from conferring any title except military or academic distinctions." },
        { q: "Under which Article can the President impose President's Rule in a State?", o: ["Article 352", "Article 356", "Article 360", "Article 365"], c: 1, e: "Article 356 empowers the President to impose President's Rule if the governance of a State cannot be carried on in accordance with the Constitution." },
        { q: "The 'Residuary Powers' in the Indian Constitution vest in:", o: ["State Legislature", "Parliament", "Both equally", "Judiciary"], c: 1, e: "Unlike the USA, in India, residuary powers vest in the Parliament under Article 248 (Entry 97 of Union List)." },
        { q: "Consider the following:\n1. The Vice President is the ex-officio Chairman of Rajya Sabha.\n2. The Vice President is elected by members of both Houses.\nWhich is/are correct?", o: ["1 only", "2 only", "Both 1 and 2", "Neither"], c: 2, e: "The Vice President is ex-officio Chairman of Rajya Sabha (Art. 64) and is elected by members of both Houses of Parliament (Art. 66)." },
        { q: "Which of the following writs can be issued only against judicial or quasi-judicial authorities?", o: ["Habeas Corpus", "Mandamus", "Certiorari", "Quo Warranto"], c: 2, e: "Certiorari is issued to a lower court or tribunal to transfer a case to the higher court for review." },
        { q: "The concept of 'Directive Principles of State Policy' was borrowed from:", o: ["USA", "UK", "Ireland", "Australia"], c: 2, e: "The Directive Principles were borrowed from the Irish Constitution." },
        { q: "Consider the following statements:\n1. Article 32 is a Fundamental Right.\n2. Article 226 gives wider powers to High Courts than Article 32 gives to the Supreme Court.\nWhich is/are correct?", o: ["1 only", "2 only", "Both 1 and 2", "Neither"], c: 2, e: "Article 32 itself is a Fundamental Right. Article 226 gives wider powers to HCs as they can issue writs for any purpose, not just fundamental rights enforcement." },
        { q: "The 'pocket veto' means the President:", o: ["Rejects the bill outright", "Sends the bill back for reconsideration", "Neither signs nor returns the bill", "Signs the bill with conditions"], c: 2, e: "A pocket veto occurs when the President neither signs nor returns a bill, effectively killing it without formal rejection." },
        { q: "Which Schedule of the Constitution deals with languages?", o: ["Seventh Schedule", "Eighth Schedule", "Ninth Schedule", "Tenth Schedule"], c: 1, e: "The Eighth Schedule originally contained 14 languages and now recognizes 22 languages." },
        { q: "The concept of 'Fundamental Duties' was recommended by which committee?", o: ["Sarkaria Commission", "Swaran Singh Committee", "Balwant Rai Mehta Committee", "Ashok Mehta Committee"], c: 1, e: "The Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties, which were added by the 42nd Amendment." },
        { q: "Consider the following about a No-Confidence Motion:\n1. It can only be moved in Lok Sabha.\n2. It needs 50 members' support to be admitted.\n3. If passed, the entire Council of Ministers must resign.\nWhich is/are correct?", o: ["1 and 3 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], c: 0, e: "A No-Confidence Motion can only be moved in Lok Sabha and requires 50 members' support. If passed, the entire Council of Ministers must resign." },
        { q: "Which constitutional amendment introduced the concept of co-operative societies as a fundamental right?", o: ["95th Amendment", "97th Amendment", "99th Amendment", "100th Amendment"], c: 1, e: "The 97th Amendment (2011) gave constitutional status to co-operative societies by amending Article 19(1)(c) and adding Part IXB." },
        { q: "The Election Commission of India is a:", o: ["Single-member body", "Three-member body", "Constitutional body that can be single or multi-member", "Parliamentary committee"], c: 2, e: "The Election Commission is a constitutional body. It can be single or multi-member as per the President's decision. Currently, it has a Chief Election Commissioner and Election Commissioners." },
        { q: "Under which Article can Parliament form new States?", o: ["Article 1", "Article 2", "Article 3", "Article 4"], c: 2, e: "Article 3 empowers Parliament to form new States, alter boundaries, and change names of existing States." },
        { q: "The Comptroller and Auditor General submits audit reports to:", o: ["Prime Minister", "President", "Parliament directly", "Finance Ministry"], c: 1, e: "The CAG submits reports to the President (for Union) or Governor (for States), who then places them before Parliament/Legislature." },
        { q: "Consider the following statements about the Finance Commission:\n1. It is constituted every five years.\n2. It recommends the distribution of tax revenues between Union and States.\n3. Its recommendations are binding on the government.\nWhich is/are correct?", o: ["1 and 2 only", "2 only", "1, 2 and 3", "1 only"], c: 0, e: "The Finance Commission is constituted every 5 years and recommends tax distribution. However, its recommendations are advisory, not binding." },
        { q: "Which of the following is NOT a ground for disqualification of a Member of Parliament?", o: ["Holding office of profit", "Being of unsound mind", "Being an undischarged insolvent", "Being above 70 years of age"], c: 3, e: "There is no age-based disqualification for MPs. The grounds include office of profit, unsound mind, undischarged insolvency, and non-citizenship." },
        { q: "The 'Doctrine of Pleasure' in India applies to:", o: ["Supreme Court judges", "High Court judges", "Ministers", "CAG"], c: 2, e: "Ministers hold office during the pleasure of the President (Article 75). This doctrine doesn't apply to judges or the CAG who have fixed terms/removal procedures." },
        { q: "Which type of majority is required to amend the Constitution under Article 368?", o: ["Simple majority only", "Special majority only", "Special majority plus ratification by states for some provisions", "Two-thirds of total membership"], c: 2, e: "Some amendments need special majority only, while others additionally require ratification by at least half of the State Legislatures." },
        { q: "The Advocate General of a State is appointed under which Article?", o: ["Article 148", "Article 155", "Article 165", "Article 177"], c: 2, e: "Article 165 provides for the appointment of the Advocate General of a State by the Governor." },
        { q: "Consider the following about the Rajya Sabha:\n1. It has a maximum strength of 250 members.\n2. One-third of its members retire every two years.\n3. It cannot be dissolved.\nWhich is/are correct?", o: ["1 and 3 only", "2 and 3 only", "1, 2 and 3", "3 only"], c: 2, e: "Rajya Sabha has a max strength of 250 (238 elected + 12 nominated), one-third retire every 2 years, and it is a permanent body that cannot be dissolved." },
        { q: "Which Article provides for the establishment of Gram Nyayalayas?", o: ["Article 39A", "Article 40", "Article 50", "None – it was established by an Act of Parliament"], c: 3, e: "Gram Nyayalayas were established by the Gram Nyayalayas Act, 2008, not directly by the Constitution. Article 39A deals with equal justice and free legal aid." },
        { q: "The concept of 'Single Citizenship' in India is borrowed from:", o: ["USA", "UK", "Canada", "France"], c: 1, e: "India adopted the concept of single citizenship from Britain, unlike the dual citizenship in the USA." },
        { q: "Consider the following about Legislative Council (Vidhan Parishad):\n1. It can be created or abolished by Parliament.\n2. Its total strength cannot exceed one-third of State Assembly.\n3. Members serve six-year terms.\nWhich is/are correct?", o: ["1 and 2 only", "2 and 3 only", "1, 2 and 3", "1 and 3 only"], c: 2, e: "All three are correct. Parliament creates/abolishes it on the State Assembly's resolution. Its strength is max one-third of Assembly. Members serve 6-year terms." },
        { q: "Under which Article does the Supreme Court have Original Jurisdiction?", o: ["Article 131", "Article 132", "Article 136", "Article 141"], c: 0, e: "Article 131 gives the Supreme Court original jurisdiction in disputes between the Government of India and State(s), or between States." },
        { q: "The provisions relating to citizenship in India are contained in:", o: ["Part I, Articles 1-4", "Part II, Articles 5-11", "Part III, Articles 12-35", "Part IV, Articles 36-51"], c: 1, e: "Part II (Articles 5-11) deals with Citizenship in the Indian Constitution." },
        { q: "Which body recommends the creation of All India Services?", o: ["Parliament", "Rajya Sabha", "UPSC", "Inter-State Council"], c: 1, e: "Under Article 312, the Rajya Sabha can pass a resolution by special majority to create new All India Services." },
        { q: "The concept of 'Judicial Activism' is most closely associated with which type of jurisdiction?", o: ["Original Jurisdiction", "Appellate Jurisdiction", "Public Interest Litigation", "Advisory Jurisdiction"], c: 2, e: "Judicial Activism in India is most closely associated with PIL, which allows courts to take up cases on behalf of disadvantaged groups." },
        { q: "Consider the following about Money Bills:\n1. The Speaker certifies whether a bill is a Money Bill.\n2. Rajya Sabha can amend a Money Bill.\n3. If Rajya Sabha doesn't return it within 14 days, it is deemed passed.\nWhich is/are correct?", o: ["1 and 3 only", "1 only", "2 and 3 only", "1, 2 and 3"], c: 0, e: "The Speaker's certification is final (Art. 110). Rajya Sabha can only recommend amendments (not amend directly). If not returned in 14 days, it's deemed passed." },
      ],
      A: [
        { q: "Consider the following statements:\n1. The President can return a Constitutional Amendment Bill for reconsideration.\n2. The 24th Amendment clarified that Parliament has the power to amend any part of the Constitution.\n3. The Basic Structure doctrine was first applied to strike down a law in the Minerva Mills case.\nWhich is/are correct?", o: ["2 only", "1 and 2 only", "2 and 3 only", "1, 2 and 3"], c: 0, e: "The President cannot return a Constitutional Amendment Bill (must assent). The 24th Amendment clarified amending power. The Basic Structure doctrine was first used to strike down in Kesavananda Bharati (1973), not Minerva Mills (1980)." },
        { q: "In which of the following situations can the Parliament legislate on State List subjects?\n1. During National Emergency\n2. When Rajya Sabha passes a resolution under Article 249\n3. For implementing international treaties under Article 253\n4. During President's Rule under Article 356\nSelect the correct answer:", o: ["1, 2 and 3 only", "1 and 4 only", "1, 2, 3 and 4", "2 and 3 only"], c: 2, e: "All four are correct situations where Parliament can legislate on State List subjects." },
        { q: "Consider the following about the Election Commission:\n1. The Chief Election Commissioner can be removed only through impeachment.\n2. Other Election Commissioners can be removed on the recommendation of the CEC.\n3. The Constitution does not prescribe qualifications for Election Commissioners.\nWhich is/are correct?", o: ["1 and 3 only", "2 and 3 only", "3 only", "1, 2 and 3"], c: 3, e: "CEC is removed like a SC judge. Other ECs are removed on CEC's recommendation. The Constitution prescribes no qualifications for ECs." },
        { q: "With reference to the 'Doctrine of Severability' and 'Doctrine of Eclipse', which of the following is correct?", o: ["Severability applies to pre-constitutional laws only", "Eclipse applies only to post-constitutional laws", "Severability means the invalid part of a law is severed while the valid part survives", "Both doctrines were introduced by the 42nd Amendment"], c: 2, e: "Doctrine of Severability means if a part of a law violates fundamental rights, only that part is void, the rest survives. Eclipse applies to pre-constitutional laws (they are overshadowed but not dead)." },
        { q: "Consider the following about the 42nd Amendment Act:\n1. It added the words 'Socialist' and 'Secular' to the Preamble.\n2. It transferred five subjects from State List to Concurrent List.\n3. It added Fundamental Duties.\n4. It curtailed the power of Judicial Review.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 3 and 4 only", "1, 2, 3 and 4", "2, 3 and 4 only"], c: 2, e: "The 42nd Amendment (1976) did all of the above. It was called the 'Mini-Constitution' for its sweeping changes." },
        { q: "With reference to inter-state relations, consider:\n1. Inter-State Water Disputes are adjudicated under Article 262.\n2. The decision of the tribunal is final and cannot be questioned in any court.\n3. Zonal Councils are constitutional bodies.\nWhich is/are correct?", o: ["1 and 2 only", "1 only", "2 and 3 only", "1, 2 and 3"], c: 0, e: "Article 262 deals with inter-state water disputes. Tribunal decisions are final (excluded from SC jurisdiction). Zonal Councils are NOT constitutional bodies — they were created by the States Reorganisation Act, 1956." },
        { q: "Consider the following regarding the National Commission for Scheduled Castes:\n1. It is a constitutional body established under Article 338.\n2. It investigates complaints related to deprivation of safeguards for SCs.\n3. It has the powers of a civil court for investigation purposes.\nWhich is/are correct?", o: ["1 and 2 only", "2 and 3 only", "1, 2 and 3", "1 only"], c: 2, e: "All are correct. The NCSC is constitutional (Art. 338), investigates complaints regarding SC safeguards, and has civil court powers." },
        { q: "In the context of the Anti-Defection Law (Tenth Schedule), consider:\n1. An independent member is deemed defected if they join any political party.\n2. A nominated member can join a political party within six months.\n3. The decision of the Speaker/Chairman is subject to judicial review.\nWhich is/are correct?", o: ["1 and 2 only", "1, 2 and 3", "1 and 3 only", "2 and 3 only"], c: 1, e: "All are correct. Independents defect by joining any party. Nominated members get 6 months. After Kihoto Hollohan case, Speaker's decisions are subject to judicial review." },
        { q: "Consider the following about the Ninth Schedule:\n1. Laws placed in the Ninth Schedule are completely immune from judicial review.\n2. It was added by the 1st Amendment in 1951.\n3. After the I.R. Coelho case, laws added after 24 April 1973 can be challenged if they violate the basic structure.\nWhich is/are correct?", o: ["1 and 2 only", "2 and 3 only", "1, 2 and 3", "2 only"], c: 1, e: "Laws in the 9th Schedule are NOT completely immune after I.R. Coelho case (2007). The Schedule was added by the 1st Amendment. Post-1973 additions can be challenged if they violate basic structure." },
        { q: "Consider the following about State Emergency under Article 356:\n1. It can be imposed only on failure of constitutional machinery.\n2. The maximum duration is 3 years with Parliamentary approval every 6 months.\n3. The S.R. Bommai case laid down guidelines to prevent its misuse.\nWhich is/are correct?", o: ["1 and 3 only", "1, 2 and 3", "2 and 3 only", "1 only"], c: 0, e: "Article 356 requires failure of constitutional machinery. Max duration is 3 years (with Parliamentary approval). The S.R. Bommai case (1994) made President's Rule subject to judicial review." },
        { q: "With reference to the Consolidated Fund and Contingency Fund:\n1. All taxes and revenues of the Government flow into the Consolidated Fund.\n2. Expenditure from the Consolidated Fund requires Parliamentary approval.\n3. The Contingency Fund is at the disposal of the CAG.\nWhich is/are correct?", o: ["1 and 2 only", "1 only", "1, 2 and 3", "2 and 3 only"], c: 0, e: "All revenues go to the Consolidated Fund (Art. 266). Parliamentary approval is needed for expenditure. The Contingency Fund is at the disposal of the President, not the CAG." },
        { q: "Consider the following about Amendment procedures:\n1. Simple majority is needed for admission of new states.\n2. Special majority is needed for Fundamental Rights amendments.\n3. Special majority plus ratification is needed for federal provisions.\n4. Private members can introduce amendment bills.\nWhich are correct?", o: ["1, 2 and 3 only", "2, 3 and 4 only", "1, 2, 3 and 4", "1 and 3 only"], c: 2, e: "All four are correct. Simple majority for new states (Art. 2-4). Special majority for Fundamental Rights. Special majority + ratification for federal provisions. Any MP can introduce amendment bills." },
        { q: "In the context of 'Separation of Powers' in India, consider:\n1. India follows a strict separation of powers like the USA.\n2. The legislature can exercise judicial functions during impeachment.\n3. The judiciary can exercise legislative function through judicial review.\nWhich is/are correct?", o: ["2 only", "2 and 3 only", "1 and 2 only", "1, 2 and 3"], c: 0, e: "India does NOT follow strict separation (functional overlap exists). Legislature exercises judicial function during impeachment. Judicial review is NOT legislative function — it's checking constitutionality, not making laws." },
        { q: "Consider the following about Panchayati Raj institutions:\n1. The 73rd Amendment applies to all states and union territories.\n2. States with population below 20 lakhs need not have intermediate panchayat.\n3. Reservation for SCs/STs in panchayats is in proportion to their population.\n4. The State Election Commission conducts panchayat elections.\nWhich are correct?", o: ["2, 3 and 4 only", "1, 3 and 4 only", "1, 2 and 3 only", "1, 2, 3 and 4"], c: 0, e: "The 73rd Amendment does NOT apply to Nagaland, Meghalaya, Mizoram, and certain scheduled areas. States with population below 20 lakhs may not have intermediate level. SC/ST reservation is proportional. State Election Commission conducts elections." },
        { q: "With reference to tribunals in India:\n1. Administrative tribunals were established under the 42nd Amendment.\n2. The National Green Tribunal has been established under Article 323B.\n3. Tribunal decisions can be appealed to the Supreme Court.\nWhich is/are correct?", o: ["1 and 3 only", "1 only", "3 only", "1, 2 and 3"], c: 2, e: "Administrative tribunals were established under the 42nd Amendment (Art. 323A, 323B). NGT was established by an Act of Parliament, not directly under Art. 323B. After L. Chandra Kumar case, tribunal decisions are subject to judicial review by High Courts." },
      ],
      "Aplus": [
        { q: "In the landmark case of Golaknath v. State of Punjab (1967), the Supreme Court held that:\n1. Parliament cannot amend Fundamental Rights.\n2. Article 368 only prescribes the procedure, not the power to amend.\n3. The decision was overturned by the 24th Amendment.\nWhich is/are correct?", o: ["1 and 2 only", "1, 2 and 3", "1 only", "2 and 3 only"], c: 1, e: "All three are correct. Golaknath held FRs cannot be amended (prospective overruling). Art. 368 was seen as procedural only. The 24th Amendment explicitly added the power to amend any provision." },
        { q: "Consider the following about the doctrine of 'Colourable Legislation':\n1. It means the legislature cannot do indirectly what it cannot do directly.\n2. It applies to the procedure of law-making.\n3. It relates to the competence of the legislature.\nWhich is/are correct?", o: ["1 and 3 only", "1 and 2 only", "1 only", "1, 2 and 3"], c: 0, e: "Colourable legislation means what cannot be done directly cannot be done indirectly. It relates to legislative competence (substance), not procedure." },
        { q: "Consider the following about the relationship between Fundamental Rights and Directive Principles:\n1. The Minerva Mills case established that FRs and DPSPs are complementary.\n2. Article 31C protects laws implementing DPSPs in Articles 39(b) and 39(c) from FR challenges.\n3. The Champakam Dorairajan case held that FRs prevail over DPSPs in case of conflict.\nWhich is/are correct?", o: ["1 and 3 only", "1, 2 and 3", "2 and 3 only", "1 only"], c: 1, e: "All are correct. Minerva Mills (1980) said FRs and DPSPs are supplementary. Art. 31C (as upheld) protects laws for Art. 39(b)(c). Champakam (1951) held FRs prevail over DPSPs." },
        { q: "In the context of the 'Basic Structure Doctrine', which of the following has been identified as part of the basic structure?\n1. Judicial review\n2. Free and fair elections\n3. Rule of Law\n4. Power of Parliament to amend the Constitution\nSelect the correct answer:", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "1 and 3 only", "2 and 4 only"], c: 0, e: "Judicial review, free and fair elections, and Rule of Law are part of basic structure. The power of Parliament to amend is NOT itself a basic structure element (though its existence is — the power cannot be unlimited)." },
        { q: "Consider the following about the 44th Amendment Act:\n1. It replaced the term 'internal disturbance' with 'armed rebellion' for Emergency.\n2. It made the right to property a legal right instead of a fundamental right.\n3. It restored the powers of judiciary that were curtailed by the 42nd Amendment.\n4. It provided that fundamental rights under Articles 20 and 21 cannot be suspended during Emergency.\nWhich are correct?", o: ["1, 2 and 4 only", "1, 2, 3 and 4", "1, 2 and 3 only", "2, 3 and 4 only"], c: 1, e: "All four are correct. The 44th Amendment (1978) corrected the excesses of the 42nd Amendment across all these dimensions." },
        { q: "With reference to the concept of 'Constitutional Morality', consider the following:\n1. It was first used by Dr. B.R. Ambedkar in the Constituent Assembly.\n2. The Supreme Court has interpreted it to include pluralism and tolerance.\n3. It is explicitly defined in the Constitution.\nWhich is/are correct?", o: ["1 and 2 only", "1 only", "2 only", "1, 2 and 3"], c: 0, e: "Ambedkar first used the term. The SC has expanded it (Navtej Singh Johar case). It is NOT explicitly defined in the Constitution — it's a judicially evolved concept." },
        { q: "Consider the following about the Inter-State Council vs. NITI Aayog:\n1. The Inter-State Council is a constitutional body.\n2. NITI Aayog replaced the Planning Commission.\n3. Both have the Prime Minister as chairman.\n4. NITI Aayog's recommendations are binding on states.\nWhich are correct?", o: ["1, 2 and 3 only", "2 and 3 only", "1 and 2 only", "1, 2, 3 and 4"], c: 0, e: "ISC is constitutional (Art. 263). NITI Aayog replaced Planning Commission. Both chaired by PM. NITI Aayog's recommendations are advisory, not binding." },
        { q: "In the context of Article 142, consider:\n1. It grants the Supreme Court the power to pass any order for 'complete justice'.\n2. It has been used to dissolve marriages without the consent of both parties.\n3. It can override statutory provisions in exceptional circumstances.\nWhich is/are correct?", o: ["1 only", "1 and 2 only", "1, 2 and 3", "1 and 3 only"], c: 2, e: "Art. 142 grants 'complete justice' power. The SC has used it to dissolve marriages (Shilpa Sailesh case, 2023). It can override statutes in exceptional cases (Supreme Court Bar Association case)." },
      ],
      "Aplusplus": [
        { q: "Consider the following propositions about the interplay between Article 19(1)(a) and Article 19(2):\n1. Reasonable restrictions under Article 19(2) can be imposed only by a 'law' and not by executive action.\n2. The test of reasonableness includes both procedural and substantive elements.\n3. The burden of proving that a restriction is reasonable lies on the State.\n4. Commercial speech enjoys the same level of protection as political speech.\nWhich are correct?", o: ["1, 2 and 3 only", "1 and 3 only", "1, 2, 3 and 4", "1, 3 and 4 only"], c: 0, e: "Restrictions must be by law, not executive action. Reasonableness is both procedural and substantive. The burden is on the State. Commercial speech has LESSER protection than political speech (Tata Press case)." },
        { q: "In the context of fiscal federalism in India, consider:\n1. The GST Council is a constitutional body created by the 101st Amendment.\n2. The GST Council's recommendations are binding on Parliament and State Legislatures.\n3. The Finance Commission recommends the vertical and horizontal distribution of taxes.\n4. Cess and surcharges collected by the Centre are shareable with States.\nWhich are correct?", o: ["1 and 3 only", "1, 2 and 3 only", "1, 3 and 4 only", "1, 2, 3 and 4"], c: 0, e: "GST Council is constitutional (Art. 279A, 101st Amendment). Its recommendations are NOT binding (Union of India v. Mohit Minerals). FC recommends vertical and horizontal distribution. Cess and surcharges are NOT shareable with States." },
        { q: "Consider the following about the evolution of 'Right to Privacy':\n1. In M.P. Sharma case (1954), the SC held there is no fundamental right to privacy.\n2. In Kharak Singh case (1962), the majority denied the right to privacy.\n3. In Puttaswamy case (2017), a 9-judge bench unanimously held privacy as a fundamental right under Article 21.\n4. The right to privacy is absolute and cannot be restricted.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "3 only", "2 and 3 only"], c: 0, e: "M.P. Sharma and Kharak Singh denied privacy as fundamental right. Puttaswamy overruled both and established privacy under Art. 21. Privacy is NOT absolute — it is subject to reasonable restrictions." },
        { q: "In the context of 'Transformative Constitutionalism' as applied by Indian courts, which of the following represents the most accurate understanding?\n1. The Constitution is a living document that must be interpreted to address changing social realities.\n2. It requires the judiciary to always defer to legislative intent.\n3. It was invoked in Navtej Singh Johar to decriminalize Section 377.\n4. It mandates that constitutional interpretation must advance substantive equality.\nWhich are correct?", o: ["1, 3 and 4 only", "1 and 3 only", "1, 2 and 3 only", "1, 2, 3 and 4"], c: 0, e: "Transformative constitutionalism treats the Constitution as a living document, was invoked in Navtej Singh Johar, and advances substantive equality. It does NOT require deference to legislative intent — it empowers courts to challenge legislative choices." },
        { q: "Consider the following about the concept of 'Cooperative Federalism' and 'Competitive Federalism' in India:\n1. Cooperative federalism emphasizes collaboration between Centre and States.\n2. The GST framework is an example of cooperative federalism.\n3. NITI Aayog promotes competitive federalism through performance-based rankings.\n4. The concept of competitive federalism was part of the original constitutional design.\nWhich are correct?", o: ["1, 2 and 3 only", "1 and 2 only", "1, 2, 3 and 4", "1, 3 and 4 only"], c: 0, e: "Cooperative federalism = collaboration (GST is a prime example). NITI Aayog promotes competitive federalism. Competitive federalism was NOT part of the original design — it evolved later." },
      ]
    },
    History: {
      C: [
        { q: "The Battle of Plassey was fought in which year?", o: ["1757", "1764", "1857", "1761"], c: 0, e: "The Battle of Plassey was fought in 1757 between the British East India Company and the Nawab of Bengal." },
        { q: "Who founded the Indian National Congress in 1885?", o: ["A.O. Hume", "Dadabhai Naoroji", "Surendranath Banerjee", "W.C. Bonnerjee"], c: 0, e: "Allan Octavian Hume founded the Indian National Congress in 1885." },
        { q: "The Quit India Movement was launched in which year?", o: ["1940", "1942", "1944", "1946"], c: 1, e: "The Quit India Movement was launched on 8 August 1942 by Mahatma Gandhi." },
        { q: "The Regulating Act was passed in which year?", o: ["1773", "1784", "1793", "1813"], c: 0, e: "The Regulating Act of 1773 was the first step by the British Parliament to regulate East India Company affairs." },
        { q: "Who was the last Viceroy of British India?", o: ["Lord Mountbatten", "Lord Curzon", "Lord Wavell", "Lord Irwin"], c: 0, e: "Lord Mountbatten was the last Viceroy, overseeing the transition of power in 1947." },
        { q: "The Jallianwala Bagh massacre occurred in which year?", o: ["1917", "1919", "1921", "1929"], c: 1, e: "The massacre took place on 13 April 1919 in Amritsar when General Dyer ordered firing on unarmed civilians." },
        { q: "Champaran Satyagraha (1917) was related to:", o: ["Salt tax", "Indigo plantation", "Land revenue", "Textile workers"], c: 1, e: "The Champaran Satyagraha was against the forced indigo farming system." },
        { q: "The Simon Commission visited India in which year?", o: ["1925", "1927", "1928", "1930"], c: 2, e: "The Simon Commission arrived in 1928 to study constitutional reforms." },
        { q: "Who gave the slogan 'Jai Jawan Jai Kisan'?", o: ["Mahatma Gandhi", "Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi"], c: 2, e: "PM Lal Bahadur Shastri gave this slogan in 1965 during the Indo-Pak war." },
        { q: "Sardar Vallabhbhai Patel is associated with which movement?", o: ["Non-Cooperation", "Bardoli Satyagraha", "Salt March", "Quit India"], c: 1, e: "Patel led the Bardoli Satyagraha (1928) against increased tax on farmers in Gujarat." },
        { q: "The Chipko Movement was associated with:", o: ["Land reforms", "Water conservation", "Forest conservation", "Women's rights"], c: 2, e: "The Chipko Movement was a forest conservation movement that began in 1973 in Uttarakhand." },
        { q: "The 'Swachh Bharat Mission' was launched on whose birth anniversary?", o: ["Jawaharlal Nehru", "B.R. Ambedkar", "Mahatma Gandhi", "Subhas Chandra Bose"], c: 2, e: "Swachh Bharat Mission was launched on 2 October 2014, Gandhi's birth anniversary." },
        { q: "Who was the first woman Chief Minister of an Indian state?", o: ["Indira Gandhi", "Sucheta Kriplani", "Jayalalithaa", "Mayawati"], c: 1, e: "Sucheta Kriplani became the first woman CM (UP) in 1963." },
        { q: "Who was the first Indian to receive the Nobel Prize?", o: ["C.V. Raman", "Rabindranath Tagore", "Amartya Sen", "Har Gobind Khorana"], c: 1, e: "Tagore received the Nobel Prize in Literature in 1913 for 'Gitanjali'." },
        { q: "The 'Green Revolution' in India was led by:", o: ["Verghese Kurien", "M.S. Swaminathan", "Norman Borlaug", "C. Subramaniam"], c: 1, e: "M.S. Swaminathan is the Father of Green Revolution in India." },
        { q: "The first Five Year Plan was launched in which year?", o: ["1947", "1950", "1951", "1956"], c: 2, e: "The First Five Year Plan was launched in 1951, focusing on agriculture and irrigation." },
        { q: "NITI Aayog replaced which institution?", o: ["Finance Commission", "Planning Commission", "Election Commission", "Law Commission"], c: 1, e: "NITI Aayog replaced the Planning Commission on 1 January 2015." },
        { q: "The GST was implemented on:", o: ["1 April 2017", "1 July 2017", "1 January 2018", "1 April 2018"], c: 1, e: "GST was launched on 1 July 2017 through the 101st Constitutional Amendment Act." },
        { q: "Which plan is also known as the 'Mahalanobis Plan'?", o: ["First Five Year Plan", "Second Five Year Plan", "Third Five Year Plan", "Fourth Five Year Plan"], c: 1, e: "The Second FYP (1956-61) was based on the Mahalanobis Model, focusing on rapid industrialization." },
        { q: "The FRBM Act was passed in:", o: ["2001", "2003", "2005", "2007"], c: 1, e: "The Fiscal Responsibility and Budget Management Act was enacted in 2003." },
      ],
      B: [
        { q: "Consider the following about the Revolt of 1857:\n1. It started from Meerut on 10 May 1857.\n2. Bahadur Shah Zafar was declared the Emperor by the rebels.\n3. The revolt was limited to North India.\nWhich is/are correct?", o: ["1 and 2 only", "1 only", "1, 2 and 3", "2 and 3 only"], c: 0, e: "The revolt started from Meerut and Bahadur Shah II was declared Emperor. However, it was not limited to North India — it spread to parts of Central and Eastern India too." },
        { q: "The Permanent Settlement was introduced in which year and by whom?", o: ["1793, Lord Cornwallis", "1793, Lord Wellesley", "1820, Lord Hastings", "1793, Lord Canning"], c: 0, e: "Lord Cornwallis introduced the Permanent Settlement in 1793 in Bengal, fixing land revenue permanently." },
        { q: "Consider the following about the Morley-Minto Reforms (1909):\n1. They introduced separate electorates for Muslims.\n2. They introduced bicameral legislature at the centre.\n3. Indians were appointed to the Viceroy's Executive Council for the first time.\nWhich is/are correct?", o: ["1 and 3 only", "1 only", "1 and 2 only", "1, 2 and 3"], c: 0, e: "Morley-Minto Reforms introduced separate electorates and allowed Indians in Viceroy's council. Bicameral legislature was introduced later by Montagu-Chelmsford Reforms." },
        { q: "Consider the following about the Indian Independence Act 1947:\n1. It abolished the office of Secretary of State for India.\n2. India and Pakistan became dominions.\n3. The Constituent Assembly was to act as Parliament until elections.\nWhich is/are correct?", o: ["1, 2 and 3", "2 and 3 only", "1 and 2 only", "2 only"], c: 0, e: "All three are correct. The Independence Act abolished the Secretary of State, created two dominions, and the CA functioned as Parliament." },
        { q: "The Rowlatt Act of 1919 was opposed because:", o: ["It imposed excessive taxes", "It allowed detention without trial", "It banned political parties", "It restricted trade unions"], c: 1, e: "The Rowlatt Act allowed the British to imprison any person suspected of terrorism without warrant or trial." },
        { q: "Consider the following about the Cabinet Mission Plan (1946):\n1. It rejected the demand for Pakistan.\n2. It proposed a three-tier federal structure.\n3. It recommended a Constituent Assembly for India.\nWhich is/are correct?", o: ["1, 2 and 3", "1 and 3 only", "2 and 3 only", "1 only"], c: 0, e: "The Cabinet Mission rejected Pakistan, proposed a three-tier structure (Union-Groups-Provinces), and recommended a Constituent Assembly." },
        { q: "The Cripps Mission came to India in:", o: ["1940", "1942", "1944", "1946"], c: 1, e: "The Cripps Mission came in 1942 with proposals for Indian cooperation in WWII in exchange for future dominion status." },
        { q: "Consider the following about the Swadeshi Movement:\n1. It was launched in response to the partition of Bengal (1905).\n2. It promoted the use of indigenous goods.\n3. Rabindranath Tagore composed 'Amar Sonar Bangla' during this movement.\nWhich is/are correct?", o: ["1 and 2 only", "1, 2 and 3", "2 and 3 only", "1 only"], c: 1, e: "All three are correct. The Swadeshi Movement arose from Bengal partition, promoted indigenous goods, and inspired Tagore's famous composition." },
        { q: "Consider the following about the Lucknow Pact (1916):\n1. It was an agreement between Congress and Muslim League.\n2. Tilak played a key role in the pact.\n3. It accepted separate electorates for Muslims.\nWhich is/are correct?", o: ["1 and 2 only", "1, 2 and 3", "1 and 3 only", "2 and 3 only"], c: 1, e: "All three are correct. The Lucknow Pact brought Congress-League unity, Tilak was instrumental, and Congress accepted separate electorates." },
        { q: "The Khilafat Movement was launched in India in support of:", o: ["Indian independence", "The Ottoman Caliph", "Hindu-Muslim unity", "The partition of Bengal"], c: 1, e: "The Khilafat Movement (1919-24) was launched by Indian Muslims to support the Ottoman Caliph against the Treaty of Sèvres." },
      ],
      A: [
        { q: "Consider the following about the Non-Cooperation Movement:\n1. It was launched in 1920.\n2. It was withdrawn after the Chauri Chaura incident.\n3. C.R. Das and Motilal Nehru formed the Swaraj Party after its withdrawal.\n4. The movement achieved all its stated objectives.\nWhich are correct?", o: ["1, 2 and 3 only", "1 and 2 only", "1, 2, 3 and 4", "2, 3 and 4 only"], c: 0, e: "NCM was launched in 1920, withdrawn after Chauri Chaura (1922). Das and Nehru formed Swaraj Party. The movement did NOT achieve its objectives." },
        { q: "Consider the following about the Drain Theory:\n1. It was propounded by Dadabhai Naoroji.\n2. R.C. Dutt further elaborated on it.\n3. It argued that India's wealth was being transferred to Britain without adequate return.\nWhich is/are correct?", o: ["1 only", "1 and 3 only", "1, 2 and 3", "2 and 3 only"], c: 2, e: "All three are correct. Naoroji propounded the theory in 'Poverty and Un-British Rule in India', Dutt elaborated in 'Economic History of India'." },
        { q: "Consider the following about the Constituent Assembly:\n1. It was formed under the Cabinet Mission Plan.\n2. It had 389 members initially.\n3. After partition, its strength was reduced to 299.\n4. Dr. Rajendra Prasad was its permanent Chairman.\nWhich are correct?", o: ["1, 2, 3 and 4", "1, 2 and 3 only", "1 and 4 only", "2, 3 and 4 only"], c: 0, e: "All are correct. The CA was formed under Cabinet Mission, had 389 members (reduced to 299 post-partition), and Dr. Rajendra Prasad was permanent Chairman." },
        { q: "Consider the following pairs of reforms and their key provisions:\n1. Montagu-Chelmsford Reforms — Introduction of Dyarchy\n2. Government of India Act, 1935 — Provincial Autonomy\n3. Indian Councils Act, 1909 — Separate Electorates\n4. Charter Act, 1833 — Governor-General of India\nWhich pairs are correctly matched?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "2, 3 and 4 only", "1 and 2 only"], c: 1, e: "All four pairs are correctly matched." },
      ],
      "Aplus": [
        { q: "Consider the following about the historical evolution of the concept of 'Dominion Status' vs. 'Purna Swaraj':\n1. The Nehru Report (1928) demanded Dominion Status.\n2. The Lahore Session (1929) demanded Purna Swaraj.\n3. The Cripps Mission (1942) offered Dominion Status after WWII.\n4. Gandhi initially supported Dominion Status but later supported Purna Swaraj.\nWhich are correct?", o: ["1, 2, 3 and 4", "1, 2 and 3 only", "1 and 2 only", "2, 3 and 4 only"], c: 0, e: "All four are correct. The shift from Dominion Status to Purna Swaraj represents the radicalization of the freedom movement." },
        { q: "Consider the following about the socio-religious reform movements:\n1. Brahmo Samaj was founded by Raja Ram Mohan Roy.\n2. Arya Samaj was founded by Dayananda Saraswati.\n3. The Prarthana Samaj was influenced by the Brahmo Samaj.\n4. The Aligarh Movement promoted Western education among Muslims.\n5. The Self-Respect Movement was started by E.V. Ramasamy Periyar.\nWhich are correct?", o: ["1, 2, 3 and 4 only", "1, 2, 3, 4 and 5", "1, 2 and 5 only", "1, 3, 4 and 5 only"], c: 1, e: "All five are correct. These represent the diverse socio-religious reform movements in modern Indian history." },
      ],
      "Aplusplus": [
        { q: "Consider the following nuanced aspects of the Drain Theory:\n1. Naoroji estimated the annual drain at £12 million in 'Poverty and Un-British Rule in India'.\n2. Critics like Morris D. Morris argued that the drain was relatively small compared to India's national income.\n3. The Home Charges (salaries, pensions paid in London) formed a significant component.\n4. The theory ignored the contribution of British investment in railways and infrastructure.\nWhich statements require qualification?", o: ["2 and 4 only", "4 only", "2, 3 and 4", "All of the above"], c: 0, e: "Statement 2 requires qualification as the percentage debate is contested. Statement 4 oversimplifies — the drain theory didn't entirely ignore infrastructure but argued the benefits were skewed. Statements 1 and 3 are factually well-established." },
        { q: "In the context of the 'Subaltern Studies' school of Indian historiography:\n1. It was initiated by Ranajit Guha in the 1980s.\n2. It challenged both colonial and nationalist elite historiography.\n3. It focused on the agency of peasants, tribals, and marginalized groups.\n4. It argued that nationalist movements were entirely driven by subaltern consciousness.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "1 and 3 only", "2, 3 and 4 only"], c: 0, e: "Subaltern Studies was initiated by Guha, challenged elite narratives, and focused on marginalized agency. However, it did NOT argue that movements were 'entirely' driven by subaltern consciousness — it recognized the interplay." },
      ]
    },
    Geography: {
      C: [
        { q: "Which Indian state has the longest coastline?", o: ["Tamil Nadu", "Maharashtra", "Gujarat", "Andhra Pradesh"], c: 2, e: "Gujarat has the longest coastline (~1,600 km)." },
        { q: "Which river is known as the 'Sorrow of Bihar'?", o: ["Ganga", "Kosi", "Son", "Gandak"], c: 1, e: "The Kosi River is called 'Sorrow of Bihar' due to devastating floods." },
        { q: "Which is the largest lake in India by area?", o: ["Dal Lake", "Chilika Lake", "Wular Lake", "Sambhar Lake"], c: 1, e: "Chilika Lake in Odisha is the largest coastal lagoon in India." },
        { q: "The Western Ghats are also known as:", o: ["Sahyadri", "Vindhyas", "Aravalli", "Satpura"], c: 0, e: "The Western Ghats are also known as Sahyadri mountains." },
        { q: "Which pass connects Srinagar to Leh?", o: ["Rohtang Pass", "Zoji La Pass", "Khyber Pass", "Banihal Pass"], c: 1, e: "Zoji La Pass connects Srinagar in Kashmir with Leh in Ladakh." },
        { q: "Which is the longest river in Peninsular India?", o: ["Krishna", "Kaveri", "Narmada", "Godavari"], c: 3, e: "Godavari is the longest river in Peninsular India (~1,465 km)." },
        { q: "The Tropic of Cancer passes through how many Indian states?", o: ["6", "7", "8", "9"], c: 2, e: "Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, WB, Tripura, Mizoram." },
        { q: "Which Indian state is the largest producer of tea?", o: ["Kerala", "West Bengal", "Assam", "Tamil Nadu"], c: 2, e: "Assam is the largest tea producer in India." },
        { q: "Which is the smallest state in India by area?", o: ["Goa", "Sikkim", "Tripura", "Nagaland"], c: 0, e: "Goa is the smallest state (~3,702 sq km)." },
        { q: "Which national park is famous for one-horned rhinoceros?", o: ["Jim Corbett", "Kaziranga", "Gir", "Ranthambore"], c: 1, e: "Kaziranga National Park in Assam is famous for the one-horned rhinoceros." },
        { q: "Which soil type is most suitable for cotton cultivation?", o: ["Alluvial soil", "Laterite soil", "Black soil", "Red soil"], c: 2, e: "Black soil (Regur soil) is ideal for cotton due to moisture retention capacity." },
        { q: "Which city is called the 'Silicon Valley of India'?", o: ["Hyderabad", "Pune", "Bengaluru", "Chennai"], c: 2, e: "Bengaluru is the Silicon Valley of India due to its IT hub status." },
        { q: "Which ocean current influences the western coast of India?", o: ["Gulf Stream", "Labrador Current", "Indian Ocean Monsoon Current", "Humboldt Current"], c: 2, e: "The Indian Ocean Monsoon Current drives the southwest monsoon." },
        { q: "Which state is the most literate in India?", o: ["Goa", "Kerala", "Mizoram", "Tripura"], c: 1, e: "Kerala has the highest literacy rate (~94%, Census 2011)." },
        { q: "The Bhakra Nangal Dam is built on which river?", o: ["Beas", "Ravi", "Sutlej", "Chenab"], c: 2, e: "Bhakra Nangal Dam is built on the Sutlej River." },
      ],
      B: [
        { q: "Consider the following about Western Ghats:\n1. They are a UNESCO World Heritage Site.\n2. They are older than the Himalayan mountain range.\n3. They run parallel to the eastern coast of India.\nWhich is/are correct?", o: ["1 and 2 only", "1 only", "1, 2 and 3", "2 and 3 only"], c: 0, e: "Western Ghats are a UNESCO WHS and older than the Himalayas. They run parallel to the WESTERN coast, not eastern." },
        { q: "Consider the following rivers and their origins:\n1. Ganga — Gangotri Glacier\n2. Yamuna — Yamunotri Glacier\n3. Godavari — Trimbakeshwar, Maharashtra\n4. Narmada — Amarkantak, Madhya Pradesh\nWhich pairs are correctly matched?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "2, 3 and 4 only", "1 and 4 only"], c: 1, e: "All four pairs are correctly matched." },
        { q: "Consider the following about Indian monsoons:\n1. The southwest monsoon accounts for about 75% of India's annual rainfall.\n2. The monsoon trough shifts northward during break monsoon conditions.\n3. The retreating monsoon brings rainfall to Tamil Nadu coast.\nWhich is/are correct?", o: ["1 and 3 only", "1, 2 and 3", "2 and 3 only", "1 only"], c: 1, e: "All three are correct. SW monsoon gives ~75% rainfall. Monsoon trough shifts northward in breaks. Retreating monsoon (NE monsoon) gives rain to Tamil Nadu." },
        { q: "Consider the following about the Deccan Plateau:\n1. It is a triangular landmass.\n2. Its average elevation is 600-900 meters.\n3. The Western Ghats form its western edge.\n4. Major rivers like Godavari and Krishna flow eastward across it.\nWhich are correct?", o: ["1, 3 and 4 only", "1, 2, 3 and 4", "2 and 3 only", "1 and 4 only"], c: 1, e: "All four statements correctly describe the Deccan Plateau." },
      ],
      A: [
        { q: "Consider the following about the El Niño-Southern Oscillation (ENSO) and Indian monsoons:\n1. El Niño events are typically associated with weak Indian monsoons.\n2. La Niña events tend to enhance Indian monsoon rainfall.\n3. The Indian Ocean Dipole (IOD) can counteract El Niño's effect on monsoons.\n4. ENSO is the only factor determining monsoon strength.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "1 and 2 only", "1 only"], c: 0, e: "El Niño weakens monsoons, La Niña enhances them, and positive IOD can counteract El Niño. ENSO is NOT the only factor — snow cover, IOD, and jet streams also matter." },
      ],
      "Aplus": [
        { q: "Consider the following about the geomorphology of Indian coastlines:\n1. The Konkan coast is characterized by estuaries and ria coastlines.\n2. The Coromandel coast experiences more cyclones than the Malabar coast.\n3. Lagoons like Chilika and Vembanad are found on the eastern coast.\n4. Mangroves in the Sundarbans are the largest mangrove ecosystem in the world.\nWhich are correct?", o: ["1, 2 and 4 only", "1, 2, 3 and 4", "2 and 4 only", "1 and 3 only"], c: 0, e: "Konkan has estuaries and rias. Coromandel experiences more cyclones. Vembanad is on the WESTERN coast (Kerala), not eastern. Sundarbans are the largest mangrove ecosystem." },
      ],
      "Aplusplus": [
        { q: "Consider the following about glacial geomorphology in the Indian Himalayas:\n1. The Siachen Glacier is the longest glacier outside polar regions.\n2. Glacial retreat in the Himalayas is primarily attributed to climate change.\n3. Terminal moraines in the Kullu Valley indicate former glacier extents.\n4. Paraglacial processes contribute significantly to sediment flux in de-glaciated valleys.\nWhich are correct?", o: ["1, 2, 3 and 4", "2, 3 and 4 only", "1 and 2 only", "1, 2 and 3 only"], c: 1, e: "Siachen is the longest glacier in the Karakoram but NOT the longest outside polar regions (several in Central Asia are longer). The other three statements are correct." },
      ]
    },
    Economy: {
      C: [
        { q: "The Reserve Bank of India was established in:", o: ["1935", "1947", "1950", "1949"], c: 0, e: "The RBI was established on 1 April 1935 under the RBI Act, 1934." },
        { q: "What is India's fiscal year?", o: ["January to December", "April to March", "July to June", "October to September"], c: 1, e: "India's fiscal year runs from 1 April to 31 March." },
        { q: "Which body controls monetary policy in India?", o: ["Finance Ministry", "SEBI", "RBI", "NITI Aayog"], c: 2, e: "The Reserve Bank of India controls monetary policy." },
        { q: "GDP stands for:", o: ["Gross Domestic Product", "General Development Plan", "Government Development Programme", "Growth and Development Projection"], c: 0, e: "GDP stands for Gross Domestic Product — the total value of goods and services produced." },
        { q: "Which sector contributes the most to India's GDP?", o: ["Agriculture", "Industry", "Services", "Mining"], c: 2, e: "The services sector contributes about 54% to India's GDP." },
        { q: "What is the full form of SEBI?", o: ["Securities and Exchange Board of India", "Stock Exchange Bureau of India", "Securities and Equity Bureau of India", "State Exchange Board of India"], c: 0, e: "SEBI — Securities and Exchange Board of India — regulates the securities market." },
        { q: "Inflation means:", o: ["Decrease in prices", "Increase in money supply", "General increase in price levels", "Increase in exports"], c: 2, e: "Inflation is a sustained increase in the general price level of goods and services." },
        { q: "The base year for calculating current GDP in India is:", o: ["2004-05", "2011-12", "2015-16", "2020-21"], c: 1, e: "The current base year for GDP calculation is 2011-12." },
      ],
      B: [
        { q: "Consider the following about the Monetary Policy Committee (MPC):\n1. It has 6 members.\n2. 3 members are appointed by the RBI and 3 by the Government.\n3. The RBI Governor has a casting vote.\nWhich is/are correct?", o: ["1, 2 and 3", "1 and 2 only", "1 only", "2 and 3 only"], c: 0, e: "All three are correct. MPC has 6 members (3 RBI + 3 Government nominees), and the Governor has a casting vote." },
        { q: "Consider the following about fiscal deficit:\n1. It is the difference between total expenditure and total revenue.\n2. It is financed by borrowing and printing money.\n3. A high fiscal deficit necessarily causes inflation.\nWhich is/are correct?", o: ["1 and 2 only", "1, 2 and 3", "1 only", "2 and 3 only"], c: 0, e: "Fiscal deficit = total expenditure - total receipts (excl. borrowings). It's financed by borrowing. High fiscal deficit doesn't NECESSARILY cause inflation — it depends on how the borrowed funds are used." },
      ],
      A: [
        { q: "Consider the following about the concept of 'Twin Balance Sheet Problem':\n1. It refers to stressed balance sheets of banks and corporates simultaneously.\n2. Over-leveraged corporates cannot repay loans, leading to NPAs in banks.\n3. Banks with high NPAs curtail lending, slowing economic growth.\n4. The solution lies solely in capital infusion into banks.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "1 and 2 only", "2, 3 and 4 only"], c: 0, e: "The Twin Balance Sheet Problem involves stressed banks and corporates. The solution requires BOTH bank recapitalization AND corporate restructuring — capital infusion alone is insufficient." },
      ],
      "Aplus": [
        { q: "Consider the following about India's current account and capital account:\n1. Current account deficit means the country imports more than it exports.\n2. FDI inflows are recorded in the capital account.\n3. Software services exports are recorded in the current account.\n4. A current account deficit can be sustainable if financed by stable capital flows.\nWhich are correct?", o: ["1, 2, 3 and 4", "1 and 2 only", "1, 3 and 4 only", "2, 3 and 4 only"], c: 0, e: "All four are correct. CAD reflects trade imbalance. FDI is capital account. IT exports are current account (services). CAD can be sustainable with stable financing." },
      ],
      "Aplusplus": [
        { q: "Consider the following about the 'Impossible Trinity' (Mundell-Fleming Trilemma) in the Indian context:\n1. India has chosen a managed float exchange rate, sacrificing complete monetary policy independence.\n2. India maintains partial capital account convertibility.\n3. The RBI's intervention in forex markets is aimed at managing the impossible trinity.\n4. Full capital account convertibility would constrain the RBI's ability to set interest rates independently.\nWhich are correct?", o: ["2, 3 and 4 only", "1, 2 and 3 only", "1, 2, 3 and 4", "2 and 4 only"], c: 0, e: "India uses managed float with partial capital convertibility, allowing some monetary independence. RBI's forex interventions manage the trinity. Full convertibility would constrain monetary policy. Statement 1 is misleading — India has NOT fully sacrificed monetary independence." },
      ]
    },
    Environment: {
      C: [
        { q: "Which gas is most responsible for global warming?", o: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], c: 1, e: "Carbon dioxide (CO2) is the primary greenhouse gas responsible for global warming." },
        { q: "The ozone layer is found in which layer of the atmosphere?", o: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], c: 1, e: "The ozone layer is found in the stratosphere, approximately 15-35 km above Earth." },
        { q: "Which is the largest tiger reserve in India?", o: ["Jim Corbett", "Sundarbans", "Nagarjunsagar-Srisailam", "Ranthambore"], c: 2, e: "Nagarjunsagar-Srisailam Tiger Reserve in Andhra Pradesh/Telangana is the largest." },
        { q: "The Paris Agreement on climate change was adopted in:", o: ["2012", "2015", "2017", "2020"], c: 1, e: "The Paris Agreement was adopted in December 2015 at COP21." },
        { q: "What does 'biodiversity hotspot' mean?", o: ["Area with extreme heat", "Area with high species diversity under threat", "Protected forest area", "Area with volcanic activity"], c: 1, e: "A biodiversity hotspot is a region with significant levels of biodiversity that is under threat from human activities." },
      ],
      B: [
        { q: "Consider the following about India's biodiversity hotspots:\n1. India has four biodiversity hotspots.\n2. Western Ghats is one of them.\n3. The Eastern Himalayas is another.\n4. The Indo-Burma region extends into Northeast India.\nWhich are correct?", o: ["1, 2, 3 and 4", "2, 3 and 4 only", "1, 2 and 3 only", "2 and 3 only"], c: 0, e: "India has 4 biodiversity hotspots: Western Ghats, Eastern Himalayas, Indo-Burma, and Sundaland (Nicobar Islands)." },
      ],
      A: [
        { q: "Consider the following about the UNFCCC framework:\n1. Common But Differentiated Responsibilities (CBDR) distinguishes between developed and developing nations.\n2. NDCs under the Paris Agreement are legally binding.\n3. The Green Climate Fund was established to help developing countries.\n4. India's NDC includes achieving 50% non-fossil fuel energy capacity by 2030.\nWhich are correct?", o: ["1 and 3 only", "1, 3 and 4 only", "1, 2 and 3 only", "1, 2, 3 and 4"], c: 1, e: "CBDR distinguishes obligations. NDCs are NOT legally binding. GCF helps developing nations. India's updated NDC targets 50% non-fossil fuel capacity by 2030." },
      ],
      "Aplus": [
        { q: "Consider the following about ecosystem services:\n1. Provisioning services include food, water, and timber.\n2. Regulating services include climate regulation and water purification.\n3. Cultural services include recreational and spiritual values.\n4. The economic value of ecosystem services exceeds global GDP.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "1 and 2 only", "1, 2 and 4 only"], c: 0, e: "The first three correctly categorize ecosystem services. While ecosystem services are extremely valuable, the claim that they exceed global GDP is contested and depends on methodology." },
      ],
      "Aplusplus": [
        { q: "Consider the following about the concept of 'Planetary Boundaries':\n1. The framework identifies nine processes that regulate the stability of the Earth system.\n2. Climate change and biosphere integrity are identified as 'core boundaries'.\n3. Six of the nine boundaries have already been transgressed.\n4. Staying within planetary boundaries guarantees sustainability at local scales.\nWhich are correct?", o: ["1, 2 and 3 only", "1, 2, 3 and 4", "1 and 2 only", "1, 3 and 4 only"], c: 0, e: "Nine processes are identified. Climate change and biosphere integrity are core. Six boundaries are transgressed. However, planetary boundaries are global concepts — staying within them doesn't guarantee LOCAL sustainability." },
      ]
    },
    Science: {
      C: [
        { q: "What is the chemical formula of water?", o: ["H2O", "CO2", "NaCl", "O2"], c: 0, e: "Water's chemical formula is H2O — two hydrogen atoms and one oxygen atom." },
        { q: "Which planet is known as the 'Red Planet'?", o: ["Venus", "Mars", "Jupiter", "Saturn"], c: 1, e: "Mars is called the Red Planet due to iron oxide on its surface." },
        { q: "What is the unit of electric current?", o: ["Volt", "Watt", "Ampere", "Ohm"], c: 2, e: "The SI unit of electric current is the Ampere (A)." },
        { q: "DNA stands for:", o: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribonitric Acid", "Deoxynucleic Acid"], c: 0, e: "DNA stands for Deoxyribonucleic Acid — the molecule that carries genetic information." },
        { q: "The speed of light is approximately:", o: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"], c: 1, e: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second." },
      ],
      B: [
        { q: "Consider the following about nuclear energy:\n1. Nuclear fission involves splitting of heavy atomic nuclei.\n2. Nuclear fusion combines light nuclei and is the process powering the Sun.\n3. India's nuclear power programme is based on a three-stage approach.\nWhich is/are correct?", o: ["1, 2 and 3", "1 and 2 only", "2 and 3 only", "1 only"], c: 0, e: "All three are correct. India's three-stage nuclear programme uses Pressurised Heavy Water Reactors, Fast Breeder Reactors, and Thorium-based reactors." },
      ],
      A: [
        { q: "Consider the following about CRISPR-Cas9 technology:\n1. It is a gene-editing tool derived from bacterial immune systems.\n2. It can add, delete, or modify specific DNA sequences.\n3. It has been used for germline editing in humans.\n4. Its use raises no ethical concerns.\nWhich are correct?", o: ["1, 2 and 3 only", "1 and 2 only", "1, 2, 3 and 4", "1, 3 and 4 only"], c: 0, e: "CRISPR is from bacterial immunity, can modify DNA, and has been used (controversially) for human germline editing. It raises significant ethical concerns." },
      ],
      "Aplus": [
        { q: "Consider the following about quantum computing:\n1. Quantum bits (qubits) can exist in superposition of states.\n2. Quantum entanglement enables correlated measurements across distances.\n3. Quantum computers will replace classical computers for all tasks.\n4. India has launched the National Quantum Mission.\nWhich are correct?", o: ["1, 2 and 4 only", "1, 2, 3 and 4", "1 and 2 only", "1, 2 and 3 only"], c: 0, e: "Qubits use superposition. Entanglement enables correlations. Quantum computers will NOT replace classical ones for ALL tasks — they excel at specific problems. India launched NQM in 2023." },
      ],
      "Aplusplus": [
        { q: "Consider the following about the Standard Model of particle physics:\n1. It describes three of the four fundamental forces.\n2. The Higgs boson gives mass to other particles through the Higgs field.\n3. It successfully incorporates gravity.\n4. Neutrinos were originally predicted to be massless in the Standard Model.\nWhich are correct?", o: ["1, 2 and 4 only", "1, 2, 3 and 4", "1 and 2 only", "1, 2 and 3 only"], c: 0, e: "The Standard Model describes electromagnetic, weak, and strong forces (not gravity). The Higgs mechanism gives mass. Gravity is NOT incorporated. Neutrinos were predicted massless but experiments showed they have mass." },
      ]
    }
  }
},

// ═══════════════════════════════════════════
// SSC
// ═══════════════════════════════════════════
ssc: {
  subjects: ['General Awareness', 'Quantitative Aptitude', 'English', 'Reasoning'],
  questionSets: {
    'General Awareness': {
      C: [
        { q: "Which vitamin is also known as Ascorbic Acid?", o: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], c: 2, e: "Vitamin C is chemically known as Ascorbic Acid." },
        { q: "Which is the smallest planet in our solar system?", o: ["Mars", "Venus", "Mercury", "Pluto"], c: 2, e: "Mercury is the smallest planet. Pluto is a dwarf planet." },
        { q: "Which blood group is a universal donor?", o: ["A", "B", "AB", "O"], c: 3, e: "O negative is the universal donor blood group." },
        { q: "What is the national animal of India?", o: ["Lion", "Elephant", "Bengal Tiger", "Leopard"], c: 2, e: "The Bengal Tiger is the national animal of India." },
        { q: "What is the hardest natural substance?", o: ["Gold", "Iron", "Diamond", "Platinum"], c: 2, e: "Diamond is the hardest known natural substance." },
        { q: "Which organ purifies blood in the human body?", o: ["Heart", "Liver", "Kidney", "Lungs"], c: 2, e: "Kidneys filter and purify blood, removing waste products." },
        { q: "The Taj Mahal was built by:", o: ["Akbar", "Shah Jahan", "Aurangzeb", "Jahangir"], c: 1, e: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal." },
        { q: "Which gas do plants absorb during photosynthesis?", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], c: 2, e: "Plants absorb CO2 and release O2 during photosynthesis." },
        { q: "The currency of Japan is:", o: ["Won", "Yuan", "Yen", "Ringgit"], c: 2, e: "The Japanese currency is Yen (¥)." },
        { q: "Which is the longest bone in the human body?", o: ["Humerus", "Tibia", "Femur", "Fibula"], c: 2, e: "The femur (thigh bone) is the longest bone in the human body." },
        { q: "The World Health Organization (WHO) is headquartered in:", o: ["New York", "Geneva", "Paris", "London"], c: 1, e: "WHO is headquartered in Geneva, Switzerland." },
        { q: "Which planet is known as the 'Morning Star'?", o: ["Mars", "Jupiter", "Venus", "Mercury"], c: 2, e: "Venus is called the Morning Star or Evening Star." },
        { q: "The study of fossils is called:", o: ["Ecology", "Paleontology", "Zoology", "Botany"], c: 1, e: "Paleontology is the study of fossils and ancient life forms." },
        { q: "Which vitamin is essential for blood clotting?", o: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], c: 3, e: "Vitamin K is essential for proper blood clotting." },
        { q: "Mount Everest is located in which country?", o: ["India", "China", "Nepal", "Nepal-China border"], c: 3, e: "Mount Everest sits on the Nepal-China (Tibet) border." },
      ],
      B: [
        { q: "Consider the following about the United Nations:\n1. It was founded in 1945.\n2. There are 5 permanent members of the Security Council.\n3. The General Assembly follows the principle of one country, one vote.\nWhich is/are correct?", o: ["1, 2 and 3", "1 and 2 only", "2 and 3 only", "1 only"], c: 0, e: "All three are correct. UN was founded in 1945. P5 are USA, UK, France, Russia, China. GA follows one country, one vote." },
        { q: "Consider the following:\n1. Tidal energy is a form of renewable energy.\n2. Geothermal energy comes from the Earth's internal heat.\n3. Biomass energy is always carbon-neutral.\nWhich is/are correct?", o: ["1 and 2 only", "1, 2 and 3", "1 only", "2 and 3 only"], c: 0, e: "Tidal and geothermal are renewable. Biomass is NOT always carbon-neutral — it depends on the sustainability of sourcing." },
      ],
      A: [
        { q: "Consider the following about the International Monetary Fund:\n1. It was established along with the World Bank at the Bretton Woods Conference.\n2. Its primary purpose is to ensure stability of the international monetary system.\n3. India is a founding member.\n4. SDR (Special Drawing Rights) is based on a basket of currencies.\nWhich are correct?", o: ["1, 2, 3 and 4", "1, 2 and 4 only", "1 and 2 only", "2, 3 and 4 only"], c: 0, e: "All four are correct. IMF was established at Bretton Woods (1944). India is a founding member. SDR is based on USD, EUR, CNY, JPY, and GBP." },
      ],
      "Aplus": [
        { q: "Consider the following about international economic organizations:\n1. The World Trade Organization replaced GATT in 1995.\n2. The BRICS New Development Bank is headquartered in Shanghai.\n3. The Asian Infrastructure Investment Bank was proposed by China.\n4. The African Development Bank allows non-African member countries.\nWhich are correct?", o: ["1, 2, 3 and 4", "1, 2 and 3 only", "1 and 3 only", "2, 3 and 4 only"], c: 0, e: "All four are correct. WTO replaced GATT. NDB is in Shanghai. AIIB was proposed by China. AfDB has non-regional members." },
      ],
      "Aplusplus": [
        { q: "Consider the following about the concept of 'Middle Income Trap':\n1. It refers to countries stagnating at middle-income levels after initial rapid growth.\n2. The transition requires a shift from factor-driven to innovation-driven growth.\n3. Most Latin American countries have successfully escaped this trap.\n4. India's per capita income puts it at risk of falling into this trap.\nWhich are correct?", o: ["1, 2 and 4 only", "1, 2, 3 and 4", "1 and 2 only", "1, 2 and 3 only"], c: 0, e: "The MIT is real (1, 2 correct). Most Latin American countries have NOT escaped it (3 is wrong). India is at risk (4 correct)." },
      ]
    },
    'Quantitative Aptitude': {
      C: [
        { q: "If 3x + 7 = 22, then x = ?", o: ["3", "4", "5", "6"], c: 2, e: "3x + 7 = 22 → 3x = 15 → x = 5." },
        { q: "What is 25% of 400?", o: ["75", "100", "125", "150"], c: 1, e: "25% of 400 = (25/100) × 400 = 100." },
        { q: "If a train travels 300 km in 5 hours, what is its speed?", o: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], c: 2, e: "Speed = Distance/Time = 300/5 = 60 km/h." },
        { q: "What is the LCM of 12 and 18?", o: ["24", "36", "48", "72"], c: 1, e: "LCM of 12 and 18 = 36." },
        { q: "A shirt costs ₹500. After 20% discount, the price is:", o: ["₹400", "₹350", "₹450", "₹380"], c: 0, e: "20% of 500 = 100. Price after discount = 500 - 100 = ₹400." },
        { q: "What is the area of a rectangle with length 8 cm and width 5 cm?", o: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], c: 2, e: "Area = length × width = 8 × 5 = 40 cm²." },
        { q: "What is the next number in the series: 2, 6, 18, 54, ?", o: ["108", "162", "128", "148"], c: 1, e: "Each number is multiplied by 3: 54 × 3 = 162." },
        { q: "Simple interest on ₹10,000 at 5% for 2 years is:", o: ["₹500", "₹1,000", "₹1,500", "₹2,000"], c: 1, e: "SI = P×R×T/100 = 10000×5×2/100 = ₹1,000." },
        { q: "What is the cube root of 27?", o: ["2", "3", "4", "9"], c: 1, e: "∛27 = 3 because 3³ = 27." },
        { q: "If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls are there?", o: ["15", "20", "25", "10"], c: 1, e: "3:2 = 30:x → x = 30×2/3 = 20 girls." },
      ],
      B: [
        { q: "A sum of money doubles itself in 8 years at simple interest. The rate of interest per annum is:", o: ["10%", "12%", "12.5%", "15%"], c: 2, e: "If sum doubles, SI = Principal. So P×R×8/100 = P → R = 100/8 = 12.5%." },
        { q: "The compound interest on ₹5,000 at 10% per annum for 2 years is:", o: ["₹1,000", "₹1,050", "₹1,100", "₹1,500"], c: 1, e: "CI = P(1+R/100)^n - P = 5000(1.1)² - 5000 = 6050 - 5000 = ₹1,050." },
        { q: "A boat can travel 20 km/h in still water. The speed of the stream is 5 km/h. Time to travel 50 km downstream is:", o: ["2 hours", "2.5 hours", "3 hours", "4 hours"], c: 0, e: "Downstream speed = 20 + 5 = 25 km/h. Time = 50/25 = 2 hours." },
        { q: "If A can do a work in 10 days and B can do it in 15 days, in how many days can they do it together?", o: ["5 days", "6 days", "7 days", "8 days"], c: 1, e: "A's rate = 1/10, B's rate = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6. So 6 days." },
      ],
      A: [
        { q: "A mixture contains milk and water in the ratio 5:3. If 16 liters of the mixture is replaced with water, the ratio becomes 3:5. What is the total quantity of the original mixture?", o: ["32 liters", "40 liters", "48 liters", "56 liters"], c: 1, e: "Let total = 8x. Milk = 5x, Water = 3x. After replacing 16L: Milk = 5x - 10, Water = 3x - 6 + 16. Ratio: (5x-10)/(3x+10) = 3/5 → x = 5. Total = 40L." },
      ],
      "Aplus": [
        { q: "Three pipes A, B, and C can fill a tank in 12, 15, and 20 hours respectively. Pipe C is a drainage pipe. If all three are opened together, in how many hours will the tank be filled?", o: ["8 hours", "10 hours", "12 hours", "15 hours"], c: 1, e: "A fills 1/12, B fills 1/15, C empties 1/20 per hour. Net = 1/12 + 1/15 - 1/20 = (5+4-3)/60 = 6/60 = 1/10. Tank fills in 10 hours." },
      ],
      "Aplusplus": [
        { q: "In a race of 200 meters, A beats B by 35 meters and B beats C by 30 meters. By how many meters does A beat C in the same race?", o: ["60.75 meters", "62.25 meters", "59.50 meters", "65 meters"], c: 1, e: "When A finishes 200m, B is at 165m. When B finishes 200m, C is at 170m. When B is at 165m, C is at 165×170/200 = 140.25m. So A beats C by 200-140.25+2.5 = 62.25m." },
      ]
    },
    English: {
      C: [
        { q: "Choose the correct synonym of 'Abundant':", o: ["Scarce", "Plentiful", "Rare", "Meagre"], c: 1, e: "'Abundant' means existing in large quantities; 'Plentiful' is its closest synonym." },
        { q: "Choose the antonym of 'Brave':", o: ["Bold", "Courageous", "Cowardly", "Fearless"], c: 2, e: "'Cowardly' is the opposite of 'Brave'." },
        { q: "Fill in the blank: She ___ to the market yesterday.", o: ["go", "goes", "went", "going"], c: 2, e: "'Went' is the past tense of 'go', appropriate for 'yesterday'." },
        { q: "Identify the correctly spelt word:", o: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"], c: 1, e: "'Accommodate' is the correct spelling — double 'c' and double 'm'." },
        { q: "Choose the correct meaning of the idiom 'Break the ice':", o: ["To break something", "To start a conversation in a social situation", "To freeze something", "To cause damage"], c: 1, e: "'Break the ice' means to initiate conversation or ease social awkwardness." },
        { q: "Select the correct passive voice of: 'She writes a letter.'", o: ["A letter was written by her.", "A letter is written by her.", "A letter has been written by her.", "A letter is being written by her."], c: 1, e: "Present simple active → Present simple passive: 'A letter is written by her.'" },
        { q: "Choose the correct one-word substitution for 'A person who speaks two languages':", o: ["Polyglot", "Bilingual", "Linguist", "Monolingual"], c: 1, e: "A bilingual person speaks two languages. A polyglot speaks many." },
      ],
      B: [
        { q: "Choose the correct sentence:", o: ["He has went to school.", "He has gone to school.", "He has go to school.", "He has going to school."], c: 1, e: "'Has gone' is the correct present perfect form of 'go'." },
        { q: "Identify the figure of speech in: 'The wind howled through the night.'", o: ["Simile", "Metaphor", "Personification", "Hyperbole"], c: 2, e: "Personification gives human qualities ('howled') to non-human things (wind)." },
      ],
      A: [
        { q: "Choose the sentence with correct punctuation:", o: ["Its a beautiful day isn't it?", "It's a beautiful day, isn't it?", "Its a beautiful day, isnt it?", "It's a beautiful day isn't it."], c: 1, e: "'It's' (contraction), comma before tag question, question mark at end." },
      ],
      "Aplus": [
        { q: "Identify the error in the sentence: 'Neither the students nor the teacher were present at the meeting.'", o: ["Neither", "nor", "were", "at the meeting"], c: 2, e: "When 'neither...nor' is used, the verb agrees with the nearest subject ('teacher' = singular). It should be 'was' not 'were'." },
      ],
      "Aplusplus": [
        { q: "Choose the sentence that best demonstrates the subjunctive mood:", o: ["If I was you, I would go.", "If I were you, I would go.", "If I am you, I would go.", "If I be you, I would go."], c: 1, e: "The subjunctive mood uses 'were' regardless of person in hypothetical/contrary-to-fact conditions: 'If I were you...'" },
      ]
    },
    Reasoning: {
      C: [
        { q: "Complete the series: 2, 4, 8, 16, ?", o: ["24", "30", "32", "36"], c: 2, e: "Each number is doubled: 16 × 2 = 32." },
        { q: "If APPLE is coded as 1-16-16-12-5, then CAT is coded as:", o: ["3-1-20", "3-2-20", "2-1-19", "3-1-19"], c: 0, e: "Each letter is coded as its position: C=3, A=1, T=20." },
        { q: "Pointing to a girl, Raj said 'She is the daughter of my mother's only son.' How is the girl related to Raj?", o: ["Sister", "Daughter", "Niece", "Cousin"], c: 1, e: "My mother's only son = Raj himself. So the girl is Raj's daughter." },
        { q: "Find the odd one out: Apple, Mango, Potato, Banana", o: ["Apple", "Mango", "Potato", "Banana"], c: 2, e: "Potato is a vegetable; the rest are fruits." },
        { q: "If Monday falls on 1st January, what day will 15th January be?", o: ["Sunday", "Monday", "Tuesday", "Wednesday"], c: 1, e: "From 1st to 15th is 14 days = 2 complete weeks. So 15th is also Monday." },
        { q: "Mirror image: If you face a mirror, your left hand appears on which side?", o: ["Left side", "Right side", "Top", "Bottom"], c: 1, e: "In a mirror, left-right is reversed. Your left hand appears on the right side." },
        { q: "Which number replaces the question mark: 3, 9, 27, 81, ?", o: ["162", "216", "243", "324"], c: 2, e: "Each number is multiplied by 3: 81 × 3 = 243." },
      ],
      B: [
        { q: "In a certain code language, 'PENCIL' is written as 'QFODJM'. How will 'ERASER' be written?", o: ["FSBTFS", "FSBTES", "FSBTFS", "DQZRDQ"], c: 0, e: "Each letter is replaced by the next letter in the alphabet: E→F, R→S, A→B, S→T, E→F, R→S = FSBTFS." },
        { q: "Statement: All roses are flowers. Some flowers are red.\nConclusion I: Some roses are red.\nConclusion II: Some flowers are roses.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], c: 1, e: "Only Conclusion II follows (All roses are flowers → some flowers are roses). Conclusion I doesn't necessarily follow." },
      ],
      A: [
        { q: "Five friends P, Q, R, S, T are sitting in a row facing north. Q is to the left of R. P is at the right end. S is between Q and P. T is to the left of Q. What is the position of S from the left end?", o: ["Second", "Third", "Fourth", "Fifth"], c: 2, e: "Arrangement from left: T, Q, R, S, P. S is 4th from left." },
      ],
      "Aplus": [
        { q: "Statement: Some teachers are doctors. All doctors are engineers. No engineer is a pilot.\nConclusion I: Some teachers are engineers.\nConclusion II: No doctor is a pilot.\nConclusion III: Some engineers are teachers.", o: ["I and II only", "I, II and III", "I and III only", "II only"], c: 1, e: "Some teachers are doctors, all doctors are engineers → some teachers are engineers (I ✓). All doctors are engineers, no engineer is pilot → no doctor is pilot (II ✓). Some teachers are engineers → some engineers are teachers (III ✓)." },
      ],
      "Aplusplus": [
        { q: "In a family of 8 persons, there are 2 couples. A is the son of B. C is the wife of D. E is the daughter of C. F is the brother of A. G is the father of D. H is the mother of B.\nHow is E related to F?", o: ["Sister", "Cousin", "Niece", "Daughter"], c: 1, e: "Working through: G-H are couple 1 (parents of B and D). B has sons A and F. D married C and has daughter E. E and F are cousins (children of siblings)." },
      ]
    }
  }
},

// For brevity, the remaining categories follow the same pattern.
// The generator will create parametric variations from these seed questions.

railways: { subjects: ['General Science', 'Mathematics', 'General Awareness', 'Reasoning'], questionSets: {} },
neet: { subjects: ['Biology', 'Physics', 'Chemistry', 'Zoology'], questionSets: {} },
norcet: { subjects: ['Fundamentals of Nursing', 'Medical-Surgical', 'Community Health', 'Pharmacology'], questionSets: {} },
jee: { subjects: ['Physics', 'Chemistry', 'Mathematics', 'Aptitude'], questionSets: {} },
gate: { subjects: ['Engineering Math', 'General Aptitude', 'Core Engineering', 'Digital Logic'], questionSets: {} },
clat: { subjects: ['Legal Reasoning', 'Logical Reasoning', 'English', 'General Knowledge'], questionSets: {} },
board: { subjects: ['Science', 'Mathematics', 'Social Studies', 'English'], questionSets: {} },
defence: { subjects: ['Mathematics', 'English', 'General Knowledge', 'Science'], questionSets: {} },
};

// ─────────────────────────────────────────
// PARAMETRIC QUESTION EXPANDER
// Generates additional questions by varying seed questions
// ─────────────────────────────────────────
function expandQuestions(seedQuestions, targetCount, rng, subject, level, category) {
  const expanded = [...seedQuestions];
  
  // If we already have enough, return
  if (expanded.length >= targetCount) return expanded.slice(0, targetCount);
  
  // Strategy 1: Rephrase existing questions
  const rephrasePatterns = [
    { prefix: "Which of the following is correct regarding", suffix: "?" },
    { prefix: "With reference to", suffix: ", which statement is true?" },
    { prefix: "Consider the following about", suffix: ":" },
    { prefix: "Regarding", suffix: ", select the correct option:" },
    { prefix: "In the context of", suffix: ", which is accurate?" },
  ];
  
  // Strategy 2: Create negation variants
  const negationPatterns = [
    "Which of the following is NOT correct?",
    "Which of the following is INCORRECT?",
    "Select the WRONG statement:",
    "Which statement is FALSE?",
  ];
  
  // Strategy 3: Difficulty-adjusted question templates
  const templates = {
    C: [
      (concept) => `What is the full form of ${concept}?`,
      (concept) => `${concept} is associated with which of the following?`,
      (concept) => `Who is considered the father/founder of ${concept}?`,
      (concept) => `In which year was ${concept} established/launched?`,
      (concept) => `${concept} is headquartered in which city?`,
      (concept) => `What is the main function of ${concept}?`,
      (concept) => `Which of the following best describes ${concept}?`,
    ],
    B: [
      (concept) => `Consider the following statements about ${concept}:\n1. Statement one.\n2. Statement two.\nWhich is/are correct?`,
      (concept) => `Which of the following is a feature of ${concept}?`,
      (concept) => `${concept} was introduced by which act/amendment?`,
      (concept) => `The primary objective of ${concept} is:`,
    ],
    A: [
      (concept) => `Consider the following statements:\n1. First assertion about ${concept}.\n2. Second assertion.\n3. Third assertion.\nWhich of the above is/are correct?`,
      (concept) => `With reference to ${concept}, consider:\n1. Statement A.\n2. Statement B.\nWhich is/are correct?`,
    ],
    Aplus: [
      (concept) => `In the context of ${concept}, which of the following represents the most accurate interpretation?`,
      (concept) => `Consider the interplay between ${concept} and related concepts:`,
    ],
    Aplusplus: [
      (concept) => `Consider the following nuanced aspects of ${concept}:`,
      (concept) => `In scholarly discourse regarding ${concept}, which perspective is most defensible?`,
    ],
  };
  
  // Generate additional questions using parametric variation
  let iteration = 0;
  while (expanded.length < targetCount && iteration < targetCount * 3) {
    iteration++;
    const sourceQ = rng.pick(seedQuestions);
    
    // Create a variation
    const variationType = Math.floor(rng.next() * 5);
    let newQ;
    
    switch (variationType) {
      case 0: // Rephrase
        const pattern = rng.pick(rephrasePatterns);
        const topic = extractTopic(sourceQ.q);
        newQ = {
          q: `${pattern.prefix} ${topic}${pattern.suffix}`,
          o: rng.shuffle([...sourceQ.o]),
          c: sourceQ.o.indexOf(sourceQ.o[sourceQ.c]),
          e: sourceQ.e
        };
        // Fix correct answer index after shuffle
        const correctText = sourceQ.o[sourceQ.c];
        newQ.c = newQ.o.indexOf(correctText);
        break;
        
      case 1: // Negation variant
        if (sourceQ.o.length === 4) {
          const wrongOptions = sourceQ.o.filter((_, i) => i !== sourceQ.c);
          const wrongAnswer = rng.pick(wrongOptions);
          newQ = {
            q: sourceQ.q.replace('?', '') + ' — Select the INCORRECT option:',
            o: rng.shuffle([...sourceQ.o]),
            c: 0, // will be fixed
            e: `The incorrect statement is: "${wrongAnswer}". ${sourceQ.e}`
          };
          newQ.c = newQ.o.indexOf(wrongAnswer);
        }
        break;
        
      case 2: // Detail focus
        newQ = {
          q: `Which of the following statements is correct?\nA. ${sourceQ.o[0]}\nB. ${sourceQ.o[1]}\nC. ${sourceQ.o[2]}\nD. ${sourceQ.o[3]}`,
          o: [`Only A`, `Only B`, `Only C`, `Only D`],
          c: sourceQ.c,
          e: sourceQ.e
        };
        break;
        
      case 3: // Context wrapper
        newQ = {
          q: `In the context of ${subject} (${LEVEL_LABELS[level]} level), ${sourceQ.q.charAt(0).toLowerCase() + sourceQ.q.slice(1)}`,
          o: [...sourceQ.o],
          c: sourceQ.c,
          e: sourceQ.e
        };
        break;
        
      default: // Direct clone with shuffled options
        const opts = rng.shuffle([...sourceQ.o]);
        const correctOpt = sourceQ.o[sourceQ.c];
        newQ = {
          q: sourceQ.q,
          o: opts,
          c: opts.indexOf(correctOpt),
          e: sourceQ.e
        };
        break;
    }
    
    if (newQ && newQ.c >= 0 && newQ.c < 4 && newQ.q) {
      // Check for exact duplicates
      const isDup = expanded.some(eq => eq.q === newQ.q);
      if (!isDup) {
        expanded.push(newQ);
      }
    }
  }
  
  return expanded.slice(0, targetCount);
}

function extractTopic(questionText) {
  // Extract a meaningful topic from the question
  const text = questionText.replace(/\n/g, ' ').replace(/Consider the following.*?:/i, '').trim();
  const words = text.split(' ').slice(0, 8).join(' ');
  return words.replace(/[?:]/g, '').trim();
}

// ─────────────────────────────────────────
// FALLBACK QUESTION GENERATOR
// Creates generic questions for categories without seed banks
// ─────────────────────────────────────────
function generateFallbackQuestions(category, subject, level, count, rng) {
  const catInfo = QUESTION_BANKS[category];
  const questions = [];
  
  // Category-specific knowledge bases for generation
  const knowledgeBases = {
    railways: {
      'General Science': [
        { q: "Which gas is used in electric bulbs?", o: ["Oxygen", "Nitrogen", "Argon", "Carbon dioxide"], c: 2, e: "Argon gas is used in electric bulbs to prevent oxidation of the filament." },
        { q: "The SI unit of force is:", o: ["Joule", "Newton", "Watt", "Pascal"], c: 1, e: "Newton (N) is the SI unit of force." },
        { q: "Which mineral is the hardest on the Mohs scale?", o: ["Quartz", "Topaz", "Diamond", "Corundum"], c: 2, e: "Diamond has a hardness of 10, the highest on the Mohs scale." },
        { q: "Photosynthesis takes place in which cell organelle?", o: ["Mitochondria", "Ribosome", "Chloroplast", "Nucleus"], c: 2, e: "Photosynthesis occurs in chloroplasts." },
        { q: "pH of pure water is:", o: ["0", "5", "7", "14"], c: 2, e: "Pure water has a neutral pH of 7." },
        { q: "Sound cannot travel through:", o: ["Air", "Water", "Vacuum", "Steel"], c: 2, e: "Sound needs a medium to travel and cannot propagate through vacuum." },
        { q: "Which vitamin deficiency causes Scurvy?", o: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], c: 2, e: "Scurvy is caused by deficiency of Vitamin C (Ascorbic acid)." },
        { q: "The chemical name of baking soda is:", o: ["Sodium chloride", "Sodium bicarbonate", "Sodium carbonate", "Calcium carbonate"], c: 1, e: "Baking soda is sodium bicarbonate (NaHCO₃)." },
        { q: "Which blood cells fight infection?", o: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], c: 1, e: "White blood cells (leucocytes) are part of the immune system." },
        { q: "The process of converting liquid to gas is called:", o: ["Condensation", "Evaporation", "Sublimation", "Solidification"], c: 1, e: "Evaporation is the process of a liquid converting to gas." },
        { q: "The powerhouse of the cell is:", o: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], c: 2, e: "Mitochondria are called the powerhouse because they produce ATP energy." },
        { q: "Which metal is liquid at room temperature?", o: ["Iron", "Mercury", "Aluminium", "Copper"], c: 1, e: "Mercury is the only metal that is liquid at room temperature." },
      ],
      'Mathematics': [
        { q: "What is 15% of 200?", o: ["25", "30", "35", "40"], c: 1, e: "15% of 200 = (15/100) × 200 = 30." },
        { q: "The average of 10, 20, 30, 40 is:", o: ["20", "25", "30", "35"], c: 1, e: "Average = (10+20+30+40)/4 = 100/4 = 25." },
        { q: "If x² = 144, then x = ?", o: ["±10", "±11", "±12", "±14"], c: 2, e: "√144 = ±12." },
        { q: "The HCF of 24 and 36 is:", o: ["6", "8", "12", "18"], c: 2, e: "HCF of 24 and 36 = 12." },
        { q: "A triangle has angles 60°, 60°, 60°. It is:", o: ["Scalene", "Isosceles", "Equilateral", "Right-angled"], c: 2, e: "All angles equal (60°) makes it an equilateral triangle." },
        { q: "What is the perimeter of a square with side 7 cm?", o: ["14 cm", "21 cm", "28 cm", "49 cm"], c: 2, e: "Perimeter = 4 × side = 4 × 7 = 28 cm." },
        { q: "Profit = ?", o: ["SP - CP", "CP - SP", "SP + CP", "SP × CP"], c: 0, e: "Profit = Selling Price - Cost Price." },
        { q: "Convert 0.75 to a fraction:", o: ["3/5", "3/4", "7/5", "7/10"], c: 1, e: "0.75 = 75/100 = 3/4." },
        { q: "The sum of angles in a quadrilateral is:", o: ["180°", "270°", "360°", "540°"], c: 2, e: "Sum of interior angles of a quadrilateral = 360°." },
        { q: "What is 2³ × 3²?", o: ["36", "48", "72", "108"], c: 2, e: "2³ = 8, 3² = 9, 8 × 9 = 72." },
      ],
      'General Awareness': [
        { q: "The Indian Railways was nationalized in:", o: ["1947", "1950", "1951", "1953"], c: 2, e: "Indian Railways was reorganized and nationalized in 1951." },
        { q: "Which is the longest railway platform in India?", o: ["Gorakhpur", "Kharagpur", "Hubballi", "Kollam"], c: 0, e: "Gorakhpur railway station has one of the longest platforms in the world." },
        { q: "The first railway line in India ran between:", o: ["Delhi and Agra", "Mumbai and Thane", "Kolkata and Delhi", "Chennai and Bangalore"], c: 1, e: "The first train ran between Mumbai (Bori Bunder) and Thane on 16 April 1853." },
        { q: "Which is the fastest train in India?", o: ["Rajdhani Express", "Shatabdi Express", "Vande Bharat Express", "Gatimaan Express"], c: 2, e: "Vande Bharat Express (Train 18) is among the fastest trains in India." },
        { q: "The headquarters of Indian Railways is in:", o: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], c: 2, e: "The Railway Board headquarters is in New Delhi." },
        { q: "Which zone of Indian Railways is the largest by route length?", o: ["Northern Railway", "Western Railway", "Eastern Railway", "Southern Railway"], c: 0, e: "Northern Railway has the largest route kilometers." },
        { q: "The Konkan Railway runs through which states?", o: ["Maharashtra, Goa, Karnataka", "Gujarat, Maharashtra, Goa", "Karnataka, Kerala, Tamil Nadu", "Maharashtra, Karnataka, Kerala"], c: 0, e: "Konkan Railway connects Maharashtra, Goa, and Karnataka along the western coast." },
        { q: "Indian Railways is the largest employer in India with approximately:", o: ["5 lakh employees", "8 lakh employees", "12 lakh employees", "15 lakh employees"], c: 2, e: "Indian Railways employs approximately 12 lakh (1.2 million) people." },
      ],
      'Reasoning': [
        { q: "Find the next number: 1, 4, 9, 16, ?", o: ["20", "24", "25", "30"], c: 2, e: "These are perfect squares: 1², 2², 3², 4², 5² = 25." },
        { q: "If BOOK is coded as CPPL, then DESK is coded as:", o: ["EFTL", "EDTL", "FDUL", "EFTM"], c: 0, e: "Each letter shifts by 1: D→E, E→F, S→T, K→L = EFTL." },
        { q: "Find the odd one out: 2, 5, 10, 17, 28, 37", o: ["10", "17", "28", "37"], c: 2, e: "Pattern: +3, +5, +7, +9, +11. After 17, next should be 26 (not 28). So 28 is the odd one." },
        { q: "If South-East becomes North, what does West become?", o: ["North-East", "South-East", "North-West", "South"], c: 0, e: "South-East rotates 135° clockwise to become North. Applying same rotation, West becomes North-East." },
        { q: "A clock shows 3:15. What is the angle between hour and minute hands?", o: ["0°", "7.5°", "15°", "22.5°"], c: 1, e: "At 3:15, minute hand is at 90°. Hour hand is at 90° + 7.5° = 97.5°. Angle = 7.5°." },
      ]
    },
    neet: {
      'Biology': [
        { q: "The functional unit of the kidney is:", o: ["Neuron", "Nephron", "Alveolus", "Villus"], c: 1, e: "Nephron is the functional unit of the kidney responsible for filtration." },
        { q: "Which organelle is responsible for protein synthesis?", o: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"], c: 1, e: "Ribosomes are the site of protein synthesis." },
        { q: "DNA replication is:", o: ["Conservative", "Semi-conservative", "Dispersive", "Non-conservative"], c: 1, e: "DNA replication is semi-conservative as proven by the Meselson-Stahl experiment." },
        { q: "Which blood vessel carries oxygenated blood from the lungs to the heart?", o: ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"], c: 1, e: "Pulmonary veins carry oxygenated blood from lungs to the left atrium." },
        { q: "The largest gland in the human body is:", o: ["Pancreas", "Thyroid", "Liver", "Pituitary"], c: 2, e: "The liver is the largest gland and internal organ in the human body." },
        { q: "Crossing over occurs during which phase of meiosis?", o: ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I"], c: 0, e: "Crossing over occurs during Pachytene stage of Prophase I of meiosis." },
        { q: "Which vitamin is synthesized by skin in presence of sunlight?", o: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], c: 3, e: "Vitamin D is synthesized when UV-B rays from sunlight hit the skin." },
        { q: "The Krebs cycle takes place in:", o: ["Cytoplasm", "Mitochondrial matrix", "Cell membrane", "Nucleus"], c: 1, e: "The Krebs cycle (citric acid cycle) occurs in the mitochondrial matrix." },
        { q: "Which hormone regulates blood sugar levels?", o: ["Thyroxine", "Adrenaline", "Insulin", "Estrogen"], c: 2, e: "Insulin, produced by beta cells of the pancreas, regulates blood glucose." },
        { q: "The ABO blood group system was discovered by:", o: ["Gregor Mendel", "Karl Landsteiner", "Louis Pasteur", "Robert Koch"], c: 1, e: "Karl Landsteiner discovered the ABO blood group system in 1901." },
        { q: "Mitosis results in:", o: ["4 haploid cells", "2 diploid cells", "4 diploid cells", "2 haploid cells"], c: 1, e: "Mitosis produces 2 genetically identical diploid daughter cells." },
        { q: "Which part of the brain controls balance and coordination?", o: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], c: 1, e: "The cerebellum is responsible for balance, coordination, and motor control." },
      ],
      'Physics': [
        { q: "The SI unit of electric charge is:", o: ["Ampere", "Coulomb", "Volt", "Ohm"], c: 1, e: "The Coulomb (C) is the SI unit of electric charge." },
        { q: "Newton's First Law is also known as:", o: ["Law of Acceleration", "Law of Inertia", "Law of Action-Reaction", "Law of Gravitation"], c: 1, e: "Newton's First Law describes inertia — a body at rest stays at rest." },
        { q: "The wavelength of visible light ranges approximately from:", o: ["100-400 nm", "400-700 nm", "700-1000 nm", "1000-1500 nm"], c: 1, e: "Visible light wavelengths range from approximately 400 nm (violet) to 700 nm (red)." },
        { q: "Which mirror is used in vehicle headlights?", o: ["Plane mirror", "Convex mirror", "Concave mirror", "None of these"], c: 2, e: "Concave mirrors are used in headlights to produce parallel beams of light." },
        { q: "The unit of power is:", o: ["Joule", "Newton", "Watt", "Pascal"], c: 2, e: "Watt (W) is the SI unit of power (1 W = 1 J/s)." },
        { q: "Which type of lens is used to correct myopia?", o: ["Convex lens", "Concave lens", "Bifocal lens", "Cylindrical lens"], c: 1, e: "Concave (diverging) lens is used to correct myopia (near-sightedness)." },
        { q: "The acceleration due to gravity on Earth's surface is approximately:", o: ["8.8 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"], c: 1, e: "The acceleration due to gravity (g) is approximately 9.8 m/s²." },
        { q: "Ohm's Law states that V = ?", o: ["IR", "I/R", "R/I", "I²R"], c: 0, e: "Ohm's Law: V = IR (Voltage = Current × Resistance)." },
      ],
      'Chemistry': [
        { q: "The atomic number of Carbon is:", o: ["4", "6", "8", "12"], c: 1, e: "Carbon has atomic number 6 (6 protons)." },
        { q: "Which gas is released when acids react with metals?", o: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon dioxide"], c: 1, e: "Acids react with metals to produce hydrogen gas and a salt." },
        { q: "The pH of a strong acid is:", o: ["0-2", "5-7", "7-9", "12-14"], c: 0, e: "Strong acids have very low pH values (0-2)." },
        { q: "Which element has the highest electronegativity?", o: ["Oxygen", "Nitrogen", "Fluorine", "Chlorine"], c: 2, e: "Fluorine has the highest electronegativity (3.98 on the Pauling scale)." },
        { q: "Rusting of iron is an example of:", o: ["Physical change", "Chemical change", "Nuclear change", "No change"], c: 1, e: "Rusting is a chemical change where iron reacts with oxygen and moisture." },
        { q: "The number of electrons in the outermost shell of noble gases (except Helium) is:", o: ["2", "4", "6", "8"], c: 3, e: "Noble gases have 8 electrons in their outermost shell (octet), providing stability." },
      ],
      'Zoology': [
        { q: "Which phylum do earthworms belong to?", o: ["Arthropoda", "Annelida", "Mollusca", "Nematoda"], c: 1, e: "Earthworms belong to phylum Annelida (segmented worms)." },
        { q: "The study of birds is called:", o: ["Ornithology", "Ichthyology", "Entomology", "Herpetology"], c: 0, e: "Ornithology is the study of birds." },
        { q: "Which is the largest mammal?", o: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], c: 1, e: "The Blue Whale is the largest mammal and the largest animal ever to live." },
        { q: "Cold-blooded animals are also called:", o: ["Endothermic", "Ectothermic", "Homeothermic", "Heterothermic"], c: 1, e: "Cold-blooded animals are ectothermic — they regulate body temperature using external sources." },
        { q: "The excretory organ of flatworms is:", o: ["Nephridia", "Flame cells", "Malpighian tubules", "Green glands"], c: 1, e: "Flame cells are the excretory structures in flatworms (Platyhelminthes)." },
      ]
    },
    norcet: {
      'Fundamentals of Nursing': [
        { q: "The normal body temperature in Fahrenheit is:", o: ["96.8°F", "97.8°F", "98.6°F", "99.6°F"], c: 2, e: "Normal body temperature is 98.6°F (37°C)." },
        { q: "Florence Nightingale is known as:", o: ["Lady with the Light", "Lady with the Lamp", "Mother of Modern Nursing", "Both B and C"], c: 3, e: "Florence Nightingale is called both 'Lady with the Lamp' and the 'Mother of Modern Nursing'." },
        { q: "The position given to an unconscious patient is:", o: ["Fowler's position", "Supine position", "Recovery (lateral) position", "Trendelenburg position"], c: 2, e: "The recovery (lateral) position prevents aspiration and maintains airway in unconscious patients." },
        { q: "Normal pulse rate in adults is:", o: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"], c: 1, e: "Normal resting pulse rate for adults is 60-100 beats per minute." },
        { q: "Hand washing should be done for at least:", o: ["5 seconds", "10 seconds", "20 seconds", "60 seconds"], c: 2, e: "WHO recommends hand washing for at least 20 seconds to effectively remove germs." },
        { q: "The most common site for intramuscular injection is:", o: ["Deltoid muscle", "Vastus lateralis", "Dorsogluteal", "Ventrogluteal"], c: 3, e: "The ventrogluteal site is considered the safest for IM injection in adults." },
        { q: "Which of the following is a vital sign?", o: ["Height", "Weight", "Blood Pressure", "BMI"], c: 2, e: "Blood pressure is one of the four main vital signs (along with temperature, pulse, and respiration)." },
        { q: "Normal respiratory rate in adults is:", o: ["8-12 breaths/min", "12-20 breaths/min", "20-30 breaths/min", "30-40 breaths/min"], c: 1, e: "Normal respiratory rate for adults is 12-20 breaths per minute." },
      ],
      'Medical-Surgical': [
        { q: "The normal blood glucose fasting level is:", o: ["50-70 mg/dL", "70-100 mg/dL", "100-140 mg/dL", "140-200 mg/dL"], c: 1, e: "Normal fasting blood glucose is 70-100 mg/dL." },
        { q: "Which electrolyte imbalance causes muscle weakness and cardiac arrhythmias?", o: ["Hyponatremia", "Hypokalemia", "Hypocalcemia", "Hypomagnesemia"], c: 1, e: "Hypokalemia (low potassium) causes muscle weakness and cardiac arrhythmias." },
        { q: "The most common type of stroke is:", o: ["Hemorrhagic", "Ischemic", "Transient Ischemic Attack", "Subarachnoid"], c: 1, e: "Ischemic strokes account for about 87% of all strokes." },
        { q: "Normal blood pressure for an adult is:", o: ["100/60 mmHg", "120/80 mmHg", "140/90 mmHg", "160/100 mmHg"], c: 1, e: "Normal blood pressure is 120/80 mmHg." },
        { q: "The Glasgow Coma Scale maximum score is:", o: ["10", "12", "15", "20"], c: 2, e: "GCS maximum is 15 (Eye: 4 + Verbal: 5 + Motor: 6)." },
      ],
      'Community Health': [
        { q: "The full form of PHC is:", o: ["Primary Health Centre", "Public Health Committee", "Patient Health Care", "Private Health Clinic"], c: 0, e: "PHC stands for Primary Health Centre — the first contact point in rural healthcare." },
        { q: "The immunization for tuberculosis is:", o: ["OPV", "DPT", "BCG", "MMR"], c: 2, e: "BCG (Bacillus Calmette-Guérin) vaccine protects against tuberculosis." },
        { q: "Which disease is transmitted by Aedes mosquito?", o: ["Malaria", "Dengue", "Filariasis", "Japanese Encephalitis"], c: 1, e: "Dengue fever is transmitted by the Aedes aegypti mosquito." },
        { q: "The WHO was established in:", o: ["1945", "1948", "1950", "1952"], c: 1, e: "The World Health Organization was established on 7 April 1948." },
        { q: "Population explosion refers to:", o: ["Decrease in death rate", "Rapid growth of population", "Increase in birth rate", "Migration"], c: 1, e: "Population explosion refers to the rapid and uncontrolled growth of population." },
      ],
      'Pharmacology': [
        { q: "Aspirin belongs to which drug category?", o: ["Antibiotic", "NSAID", "Opioid", "Antihistamine"], c: 1, e: "Aspirin is a Non-Steroidal Anti-Inflammatory Drug (NSAID)." },
        { q: "The antidote for heparin overdose is:", o: ["Vitamin K", "Protamine sulfate", "Naloxone", "Flumazenil"], c: 1, e: "Protamine sulfate is the specific antidote for heparin overdose." },
        { q: "Which route provides the fastest drug absorption?", o: ["Oral", "Subcutaneous", "Intramuscular", "Intravenous"], c: 3, e: "Intravenous (IV) provides the fastest drug absorption as it enters the bloodstream directly." },
        { q: "Insulin is produced by which cells?", o: ["Alpha cells", "Beta cells", "Delta cells", "Gamma cells"], c: 1, e: "Insulin is produced by beta cells of the islets of Langerhans in the pancreas." },
        { q: "The therapeutic index refers to:", o: ["Drug potency", "Drug efficacy", "Safety margin of a drug", "Drug absorption rate"], c: 2, e: "The therapeutic index is the ratio of toxic dose to therapeutic dose, indicating the drug's safety margin." },
      ]
    },
    jee: {
      'Physics': [
        { q: "The dimensional formula of Planck's constant is:", o: ["[ML²T⁻¹]", "[MLT⁻²]", "[ML²T⁻²]", "[ML²T⁻³]"], c: 0, e: "Planck's constant h has dimensions of energy × time = [ML²T⁻¹]." },
        { q: "A body is thrown vertically upward with velocity u. Maximum height reached is:", o: ["u/2g", "u²/2g", "u²/g", "2u²/g"], c: 1, e: "Using v² = u² - 2gh, at max height v=0: h = u²/2g." },
        { q: "The escape velocity from Earth's surface is approximately:", o: ["7.9 km/s", "11.2 km/s", "15.4 km/s", "3.2 km/s"], c: 1, e: "Escape velocity from Earth = √(2GM/R) ≈ 11.2 km/s." },
        { q: "In Young's double slit experiment, fringe width is proportional to:", o: ["Slit separation", "1/Slit separation", "Wavelength²", "1/Wavelength"], c: 1, e: "Fringe width β = λD/d, so β ∝ 1/d (inversely proportional to slit separation)." },
        { q: "The de Broglie wavelength of a particle with momentum p is:", o: ["hp", "h/p", "p/h", "h²/p"], c: 1, e: "de Broglie wavelength λ = h/p." },
        { q: "For a series LCR circuit at resonance:", o: ["Impedance is maximum", "Current is maximum", "Voltage across L and C is zero", "Power factor is zero"], c: 1, e: "At resonance, impedance is minimum (equals R), so current is maximum." },
      ],
      'Chemistry': [
        { q: "The hybridization of carbon in methane (CH₄) is:", o: ["sp", "sp²", "sp³", "sp³d"], c: 2, e: "Carbon in CH₄ has sp³ hybridization forming a tetrahedral geometry." },
        { q: "Which of the following is an example of a Lewis acid?", o: ["NH₃", "BF₃", "NaOH", "H₂O"], c: 1, e: "BF₃ is a Lewis acid as it can accept an electron pair (empty p-orbital on B)." },
        { q: "The IUPAC name of CH₃-CH=CH₂ is:", o: ["Propyne", "Propene", "Propane", "Cyclopropane"], c: 1, e: "CH₃-CH=CH₂ has a double bond, making it propene." },
        { q: "Electronegativity increases across a period because:", o: ["Atomic radius increases", "Nuclear charge increases with same shell", "Number of shells increases", "Electron-electron repulsion increases"], c: 1, e: "Across a period, nuclear charge increases while the outer shell remains the same, increasing electronegativity." },
        { q: "The shape of PCl₅ is:", o: ["Tetrahedral", "Square planar", "Trigonal bipyramidal", "Octahedral"], c: 2, e: "PCl₅ has sp³d hybridization giving a trigonal bipyramidal shape." },
      ],
      'Mathematics': [
        { q: "The derivative of sin(x) is:", o: ["-cos(x)", "cos(x)", "sin(x)", "-sin(x)"], c: 1, e: "d/dx [sin(x)] = cos(x)." },
        { q: "∫ eˣ dx = ?", o: ["eˣ + C", "xeˣ + C", "eˣ/x + C", "ln(x) + C"], c: 0, e: "The integral of eˣ is eˣ + C." },
        { q: "If A = {1,2,3} and B = {2,3,4}, then A ∩ B = ?", o: ["{1,2,3,4}", "{2,3}", "{1,4}", "{1}", ], c: 1, e: "A ∩ B contains elements common to both: {2,3}." },
        { q: "The value of log₁₀(1000) is:", o: ["2", "3", "4", "10"], c: 1, e: "log₁₀(1000) = log₁₀(10³) = 3." },
        { q: "The sum of an infinite GP with first term a and common ratio r (|r| < 1) is:", o: ["a/(1-r)", "a/(1+r)", "ar/(1-r)", "a(1-r)"], c: 0, e: "Sum of infinite GP = a/(1-r) when |r| < 1." },
        { q: "The number of ways to arrange the letters of 'BOOK' is:", o: ["24", "12", "6", "4"], c: 1, e: "BOOK has 4 letters with O repeated twice: 4!/2! = 12." },
      ],
      'Aptitude': [
        { q: "If x + y = 10 and x - y = 4, then x = ?", o: ["5", "6", "7", "8"], c: 2, e: "Adding: 2x = 14, so x = 7." },
        { q: "A clock gains 5 minutes every hour. If set correctly at 12:00, what time will it show when the actual time is 6:00 PM?", o: ["6:25 PM", "6:30 PM", "6:35 PM", "6:20 PM"], c: 1, e: "In 6 hours, it gains 6 × 5 = 30 minutes. Shows 6:30 PM." },
      ]
    },
    gate: {
      'Engineering Math': [
        { q: "The Laplace transform of 1 is:", o: ["1/s", "s", "1/s²", "1"], c: 0, e: "L{1} = 1/s for s > 0." },
        { q: "The rank of a 3×3 identity matrix is:", o: ["0", "1", "2", "3"], c: 3, e: "The identity matrix has all rows linearly independent, so rank = 3." },
        { q: "The eigenvalues of a 2×2 matrix [[3,0],[0,5]] are:", o: ["3 and 5", "0 and 8", "2 and 6", "1 and 15"], c: 0, e: "For a diagonal matrix, eigenvalues are the diagonal elements: 3 and 5." },
        { q: "The number of spanning trees of a complete graph K₄ is:", o: ["8", "12", "16", "20"], c: 2, e: "By Cayley's formula, K_n has n^(n-2) spanning trees. K₄ = 4² = 16." },
        { q: "The derivative of eˣ sin(x) is:", o: ["eˣ sin(x) + eˣ cos(x)", "eˣ cos(x)", "eˣ sin(x) - eˣ cos(x)", "2eˣ sin(x)"], c: 0, e: "Product rule: d/dx[eˣ sin(x)] = eˣ sin(x) + eˣ cos(x)." },
      ],
      'General Aptitude': [
        { q: "Complete the analogy: Book : Author :: Painting : ?", o: ["Canvas", "Brush", "Artist", "Gallery"], c: 2, e: "A book is created by an author; a painting is created by an artist." },
        { q: "If all cats are animals and some animals are pets, which must be true?", o: ["All cats are pets", "Some cats are pets", "No cats are pets", "None of the above can be concluded"], c: 3, e: "We cannot definitively conclude any of the given options from the premises alone." },
        { q: "A paragraph states: 'Renewable energy is growing rapidly. Solar power costs have dropped 90% in a decade.' The main idea is:", o: ["Solar power is cheap", "Renewable energy is becoming more viable", "All energy should be renewable", "Fossil fuels are expensive"], c: 1, e: "The main idea is that renewable energy, exemplified by solar cost drops, is becoming more viable." },
      ],
      'Core Engineering': [
        { q: "The time complexity of binary search is:", o: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], c: 1, e: "Binary search has O(log n) time complexity as it halves the search space each step." },
        { q: "In a stack, the order of operations is:", o: ["FIFO", "LIFO", "LILO", "Random"], c: 1, e: "A stack follows Last In, First Out (LIFO) order." },
        { q: "The worst-case time complexity of QuickSort is:", o: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], c: 2, e: "QuickSort's worst case is O(n²) when the pivot is always the smallest or largest element." },
        { q: "Which data structure is used for BFS traversal?", o: ["Stack", "Queue", "Heap", "Tree"], c: 1, e: "BFS (Breadth-First Search) uses a Queue data structure." },
        { q: "The number of edges in a complete graph with n vertices is:", o: ["n(n-1)", "n(n-1)/2", "n²", "2n"], c: 1, e: "A complete graph K_n has n(n-1)/2 edges." },
      ],
      'Digital Logic': [
        { q: "The binary equivalent of decimal 13 is:", o: ["1011", "1101", "1110", "1010"], c: 1, e: "13 = 8+4+1 = 1101 in binary." },
        { q: "NAND gate is called universal gate because:", o: ["It is most commonly used", "Any logic gate can be made using only NAND gates", "It uses the least power", "It is the fastest"], c: 1, e: "NAND is universal because any Boolean function can be implemented using only NAND gates." },
        { q: "The output of XOR gate when both inputs are 1 is:", o: ["0", "1", "Undefined", "High impedance"], c: 0, e: "XOR gives 0 when both inputs are the same (both 0 or both 1)." },
      ]
    },
    clat: {
      'Legal Reasoning': [
        { q: "The Constitution of India came into effect on:", o: ["15 August 1947", "26 November 1949", "26 January 1950", "30 January 1950"], c: 2, e: "The Constitution came into effect on 26 January 1950, which is celebrated as Republic Day." },
        { q: "Which Article provides the Right to Constitutional Remedies?", o: ["Article 14", "Article 19", "Article 21", "Article 32"], c: 3, e: "Article 32 provides the Right to Constitutional Remedies — the right to approach the Supreme Court for enforcement of Fundamental Rights." },
        { q: "The principle of 'Natural Justice' includes:", o: ["Right to be heard", "No one should be judge in their own cause", "Both A and B", "Neither A nor B"], c: 2, e: "Natural justice includes both audi alteram partem (right to be heard) and nemo judex in causa sua (no one judges their own case)." },
        { q: "'Habeas Corpus' literally means:", o: ["To have the body", "To be fair", "Equal justice", "Due process"], c: 0, e: "'Habeas Corpus' is Latin for 'to have the body' — it protects against unlawful detention." },
        { q: "A contract entered into by a minor is:", o: ["Valid", "Voidable", "Void ab initio", "Enforceable"], c: 2, e: "Under Indian Contract Act, agreements with minors are void ab initio (void from the beginning)." },
        { q: "The right to move freely throughout India is guaranteed under:", o: ["Article 14", "Article 19(1)(d)", "Article 21", "Article 25"], c: 1, e: "Article 19(1)(d) guarantees the right to move freely throughout the territory of India." },
      ],
      'Logical Reasoning': [
        { q: "All dogs are animals. All animals are living beings. Therefore:", o: ["All living beings are dogs", "All dogs are living beings", "Some animals are dogs", "Both B and C"], c: 3, e: "From the premises: All dogs are living beings (transitive). Also, all dogs are animals means some animals are dogs." },
        { q: "If it rains, the ground gets wet. The ground is wet. Therefore:", o: ["It must have rained", "It may have rained", "It didn't rain", "The ground is dry"], c: 1, e: "This is affirming the consequent — the ground could be wet for other reasons. So we can only say it MAY have rained." },
        { q: "Statement: Some roses are flowers. All flowers are beautiful.\nConclusion I: Some roses are beautiful.\nConclusion II: All beautiful things are flowers.", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], c: 0, e: "Some roses are flowers + all flowers are beautiful = some roses are beautiful (I ✓). But not all beautiful things need be flowers (II ✗)." },
        { q: "In a row of students, A is 7th from the left and 11th from the right. Total students in the row:", o: ["16", "17", "18", "19"], c: 1, e: "Total = 7 + 11 - 1 = 17 students." },
      ],
      'English': [
        { q: "Choose the correctly punctuated sentence:", o: ["Its a beautiful day.", "It's a beautiful day.", "Its' a beautiful day.", "Its a beautiful day!"], c: 1, e: "'It's' is the contraction of 'it is'. 'Its' is possessive." },
        { q: "Choose the correct meaning of 'Pro bono':", o: ["For the good of the public, without charge", "For profit", "Against the law", "In favor of bonuses"], c: 0, e: "'Pro bono' means professional work done for free, for the public good." },
        { q: "Select the word closest in meaning to 'Jurisprudence':", o: ["Medical science", "Philosophy of law", "Political science", "Social work"], c: 1, e: "Jurisprudence is the theory and philosophy of law." },
      ],
      'General Knowledge': [
        { q: "The Supreme Court of India is located in:", o: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], c: 2, e: "The Supreme Court of India is located in New Delhi." },
        { q: "How many High Courts are there in India?", o: ["21", "24", "25", "28"], c: 2, e: "There are 25 High Courts in India." },
        { q: "The United Nations General Assembly meets in:", o: ["Geneva", "London", "New York", "The Hague"], c: 2, e: "The UN General Assembly meets at the UN Headquarters in New York." },
      ]
    },
    board: {
      'Science': [
        { q: "The chemical formula of common salt is:", o: ["NaOH", "NaCl", "Na₂CO₃", "NaHCO₃"], c: 1, e: "Common salt is sodium chloride (NaCl)." },
        { q: "Which lens is used in a magnifying glass?", o: ["Concave lens", "Convex lens", "Plano-convex lens", "Bi-concave lens"], c: 1, e: "A convex (converging) lens is used as a magnifying glass." },
        { q: "The process by which plants make their own food is:", o: ["Respiration", "Transpiration", "Photosynthesis", "Fermentation"], c: 2, e: "Photosynthesis is the process by which plants convert sunlight, CO₂ and water into glucose." },
        { q: "Electric current is measured in:", o: ["Volts", "Amperes", "Watts", "Ohms"], c: 1, e: "Electric current is measured in Amperes (A)." },
        { q: "The atomic number of an element represents:", o: ["Number of neutrons", "Number of protons", "Atomic mass", "Number of electrons in outer shell"], c: 1, e: "The atomic number equals the number of protons in the nucleus." },
        { q: "Which gas is essential for combustion?", o: ["Nitrogen", "Hydrogen", "Oxygen", "Carbon dioxide"], c: 2, e: "Oxygen is essential for combustion (burning)." },
        { q: "The boiling point of water at sea level is:", o: ["90°C", "95°C", "100°C", "105°C"], c: 2, e: "Water boils at 100°C (212°F) at standard atmospheric pressure." },
        { q: "A concave mirror is used in:", o: ["Rear-view mirrors", "Solar cookers", "Shop security", "Kaleidoscopes"], c: 1, e: "Concave mirrors concentrate sunlight and are used in solar cookers." },
      ],
      'Mathematics': [
        { q: "The value of π (pi) is approximately:", o: ["3.14", "2.14", "4.14", "3.41"], c: 0, e: "π ≈ 3.14159... commonly approximated as 3.14." },
        { q: "What is the square root of 169?", o: ["11", "12", "13", "14"], c: 2, e: "√169 = 13 because 13² = 169." },
        { q: "The sum of interior angles of a triangle is:", o: ["90°", "180°", "270°", "360°"], c: 1, e: "The sum of interior angles of any triangle is always 180°." },
        { q: "If the diameter of a circle is 14 cm, its circumference is:", o: ["22 cm", "44 cm", "88 cm", "154 cm"], c: 1, e: "Circumference = πd = 22/7 × 14 = 44 cm." },
        { q: "What is 2⁵?", o: ["16", "25", "32", "64"], c: 2, e: "2⁵ = 2×2×2×2×2 = 32." },
        { q: "The next prime number after 7 is:", o: ["8", "9", "10", "11"], c: 3, e: "11 is the next prime after 7 (8, 9, 10 are not prime)." },
      ],
      'Social Studies': [
        { q: "The Fundamental Rights in India are guaranteed by:", o: ["Part III of the Constitution", "Part IV of the Constitution", "Part II of the Constitution", "Part V of the Constitution"], c: 0, e: "Part III (Articles 12-35) contains Fundamental Rights." },
        { q: "The Equator is an imaginary line at:", o: ["23.5° N", "23.5° S", "0° latitude", "66.5° N"], c: 2, e: "The Equator is at 0° latitude, dividing Earth into Northern and Southern hemispheres." },
        { q: "Democracy means:", o: ["Rule by military", "Rule by the people", "Rule by monarchy", "Rule by a single party"], c: 1, e: "Democracy means 'government by the people' — from Greek 'demos' (people) + 'kratos' (rule)." },
        { q: "The Industrial Revolution began in:", o: ["France", "Germany", "England", "USA"], c: 2, e: "The Industrial Revolution began in England in the late 18th century." },
        { q: "The United Nations was established in:", o: ["1942", "1945", "1948", "1950"], c: 1, e: "The UN was established on 24 October 1945 after World War II." },
      ],
      'English': [
        { q: "A word that has the same meaning as another word is called a:", o: ["Antonym", "Synonym", "Homophone", "Homonym"], c: 1, e: "A synonym is a word with the same or similar meaning." },
        { q: "The plural of 'child' is:", o: ["Childs", "Children", "Childes", "Child's"], c: 1, e: "'Children' is the irregular plural of 'child'." },
        { q: "Identify the noun in: 'The cat sat on the mat.'", o: ["sat", "on", "cat", "the"], c: 2, e: "'Cat' and 'mat' are nouns. 'Cat' is the subject noun." },
        { q: "Past tense of 'run' is:", o: ["Ran", "Runned", "Running", "Runs"], c: 0, e: "'Ran' is the past tense of 'run' (irregular verb)." },
      ]
    },
    defence: {
      'Mathematics': [
        { q: "What is the value of sin 30°?", o: ["0", "1/2", "1/√2", "√3/2"], c: 1, e: "sin 30° = 1/2." },
        { q: "The area of a circle with radius 7 cm is:", o: ["22 cm²", "44 cm²", "154 cm²", "308 cm²"], c: 2, e: "Area = πr² = 22/7 × 49 = 154 cm²." },
        { q: "If log₂(x) = 5, then x = ?", o: ["10", "25", "32", "64"], c: 2, e: "log₂(x) = 5 means x = 2⁵ = 32." },
        { q: "The sum of first 10 natural numbers is:", o: ["45", "50", "55", "60"], c: 2, e: "Sum = n(n+1)/2 = 10(11)/2 = 55." },
        { q: "cos 0° = ?", o: ["0", "1/2", "1", "-1"], c: 2, e: "cos 0° = 1." },
        { q: "The volume of a cube with side 5 cm is:", o: ["25 cm³", "50 cm³", "100 cm³", "125 cm³"], c: 3, e: "Volume = side³ = 5³ = 125 cm³." },
        { q: "What is the HCF of 12 and 16?", o: ["2", "4", "6", "8"], c: 1, e: "HCF of 12 and 16 = 4." },
        { q: "If a = 3, b = 4, then √(a² + b²) = ?", o: ["5", "6", "7", "25"], c: 0, e: "√(9 + 16) = √25 = 5." },
      ],
      'English': [
        { q: "Choose the correct spelling:", o: ["Receive", "Recieve", "Receve", "Receeve"], c: 0, e: "'Receive' follows the 'i before e, except after c' rule." },
        { q: "The antonym of 'Victory' is:", o: ["Success", "Triumph", "Defeat", "Achievement"], c: 2, e: "'Defeat' is the opposite of 'Victory'." },
        { q: "Fill in the blank: He has been working here ___ 2015.", o: ["from", "since", "for", "at"], c: 1, e: "'Since' is used with a specific point in time (2015)." },
        { q: "Choose the correct passive voice: 'They built this bridge in 1990.'", o: ["This bridge was built by them in 1990.", "This bridge is built by them in 1990.", "This bridge had been built by them in 1990.", "This bridge has been built by them in 1990."], c: 0, e: "Simple past active → Simple past passive: 'was built'." },
        { q: "The meaning of the idiom 'Once in a blue moon' is:", o: ["Very frequently", "Very rarely", "During full moon", "Never"], c: 1, e: "'Once in a blue moon' means very rarely or infrequently." },
      ],
      'General Knowledge': [
        { q: "The Supreme Commander of the Indian Armed Forces is:", o: ["Prime Minister", "Defence Minister", "President", "Chief of Defence Staff"], c: 2, e: "The President of India is the Supreme Commander of the Armed Forces." },
        { q: "NDA stands for:", o: ["National Defence Academy", "National Development Authority", "Naval Defence Academy", "National Defence Alliance"], c: 0, e: "NDA is the National Defence Academy located in Khadakwasla, Pune." },
        { q: "The Indian Army Day is celebrated on:", o: ["26 January", "15 January", "1 March", "4 December"], c: 1, e: "Indian Army Day is celebrated on 15 January." },
        { q: "The motto of the Indian Navy is:", o: ["Service Before Self", "Sham No Varunah", "Nabha Sparsham Deeptam", "Seva Paramo Dharma"], c: 1, e: "'Sham No Varunah' (May the Lord of the Seas be auspicious unto us) is the Indian Navy's motto." },
        { q: "The first Chief of Defence Staff (CDS) of India was:", o: ["Gen. M.M. Naravane", "Gen. Bipin Rawat", "Gen. Anil Chauhan", "Gen. Dalbir Singh"], c: 1, e: "General Bipin Rawat was appointed as India's first CDS in January 2020." },
        { q: "Param Vir Chakra is awarded for:", o: ["Distinguished service", "Gallantry in the face of enemy", "Most conspicuous bravery/self-sacrifice", "Long service"], c: 2, e: "Param Vir Chakra is India's highest wartime gallantry award for most conspicuous bravery or self-sacrifice." },
      ],
      'Science': [
        { q: "The chemical formula of rust is:", o: ["FeO", "Fe₂O₃", "FeCl₃", "Fe₃O₄"], c: 1, e: "Rust is hydrated iron(III) oxide, Fe₂O₃·nH₂O." },
        { q: "Sound travels fastest through:", o: ["Air", "Water", "Vacuum", "Steel"], c: 3, e: "Sound travels fastest through solids like steel (~5,960 m/s) compared to water (~1,500 m/s) and air (~343 m/s)." },
        { q: "The process of converting a solid directly to gas is:", o: ["Evaporation", "Condensation", "Sublimation", "Deposition"], c: 2, e: "Sublimation is the direct conversion of solid to gas (e.g., dry ice)." },
        { q: "Which planet has the most moons?", o: ["Jupiter", "Saturn", "Uranus", "Neptune"], c: 1, e: "Saturn has the most confirmed moons (140+) as of recent discoveries." },
        { q: "The instrument used to measure atmospheric pressure is:", o: ["Thermometer", "Barometer", "Hygrometer", "Anemometer"], c: 1, e: "A barometer measures atmospheric pressure." },
      ]
    }
  };

  const catBank = knowledgeBases[category];
  if (!catBank || !catBank[subject]) {
    // Generate generic questions
    return generateGenericQuestions(category, subject, level, count, rng);
  }
  
  const seedQuestions = catBank[subject];
  return expandQuestions(seedQuestions, count, rng, subject, level, category);
}

function generateGenericQuestions(category, subject, level, count, rng) {
  // Generate placeholder questions for uncovered subject/category combos
  const questions = [];
  const difficultyDescriptions = {
    C: 'basic', B: 'intermediate', A: 'advanced', Aplus: 'expert', Aplusplus: 'elite'
  };
  
  for (let i = 0; i < count; i++) {
    questions.push({
      q: `[${subject}] Question ${i + 1} — ${difficultyDescriptions[level]} level question about ${subject} concepts in ${category.toUpperCase()} examination.`,
      o: [`Option A — Correct answer`, `Option B — Plausible distractor`, `Option C — Common misconception`, `Option D — Unrelated answer`],
      c: 0,
      e: `This is a ${difficultyDescriptions[level]}-level question testing knowledge of ${subject} for ${category.toUpperCase()} preparation. The correct answer demonstrates understanding of core concepts.`
    });
  }
  return questions;
}

// ─────────────────────────────────────────
// MAIN GENERATOR
// ─────────────────────────────────────────
function generateAllQuestions() {
  const manifest = { generated: new Date().toISOString(), categories: {} };
  let totalGenerated = 0;

  for (const category of CATEGORIES) {
    const catData = QUESTION_BANKS[category] || {
      subjects: ['General Studies', 'Subject Knowledge', 'Quantitative & Reasoning', 'General Awareness'],
      questionSets: {}
    };
    manifest.categories[category] = { name: getCategoryName(category), subjects: catData.subjects, levels: {} };

    for (const level of LEVELS) {
      const levelLabel = LEVEL_LABELS[level];
      const allQuestions = [];
      const rng = new SeededRandom(hashCode(`${category}_${level}_2026`));

      for (const subject of catData.subjects) {
        // Try to get seed questions from our bank
        const seedQs = catData.questionSets[subject] && catData.questionSets[subject][level];
        let subjectQuestions;

        if (seedQs && seedQs.length > 0) {
          subjectQuestions = expandQuestions(seedQs, Math.ceil(TARGET_PER_LEVEL / catData.subjects.length), rng, subject, level, category);
        } else {
          subjectQuestions = generateFallbackQuestions(category, subject, level, Math.ceil(TARGET_PER_LEVEL / catData.subjects.length), rng);
        }

        // Add subject and level metadata
        subjectQuestions.forEach((q, idx) => {
          allQuestions.push({
            id: `${category}_${subject.toLowerCase().replace(/[^a-z0-9]/g, '')}_${level.toLowerCase()}_${String(allQuestions.length + 1).padStart(3, '0')}`,
            subject: subject,
            level: levelLabel,
            question: q.q,
            options: q.o,
            correct: q.c,
            explanation: q.e,
            difficulty: getDifficultyScore(level),
            source: q.source || 'generated',
            tags: [subject.toLowerCase(), category]
          });
        });
      }

      // Shuffle all questions for this level
      const shuffled = rng.shuffle(allQuestions);

      // Write JSON file
      const catDir = path.join(OUTPUT_DIR, category);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
      }
      const outputPath = path.join(catDir, `level-${level}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(shuffled, null, 2), 'utf-8');
      
      manifest.categories[category].levels[levelLabel] = {
        file: `questions/${category}/level-${level}.json`,
        count: shuffled.length,
        subjects: [...new Set(shuffled.map(q => q.subject))]
      };

      totalGenerated += shuffled.length;
      console.log(`  ✅ ${category}/${level} — ${shuffled.length} questions`);
    }
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 Total: ${totalGenerated} questions generated across ${CATEGORIES.length} categories × ${LEVELS.length} levels`);
  console.log(`📄 Manifest saved to: ${MANIFEST_PATH}`);
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function getCategoryName(id) {
  const names = {
    upsc: 'UPSC Civil Services', ssc: 'SSC CGL / CHSL', railways: 'Railways RRB',
    neet: 'NEET UG', norcet: 'AIIMS NORCET', jee: 'JEE Main',
    gate: 'GATE Exam', clat: 'CLAT Law', board: 'Board Examinations', defence: 'Defence (NDA/CDS)'
  };
  return names[id] || id;
}

function getDifficultyScore(level) {
  const scores = { C: 2, B: 4, A: 6, Aplus: 8, Aplusplus: 10 };
  return scores[level] || 5;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) || 1;
}

// ─────────────────────────────────────────
// VALIDATE MODE
// ─────────────────────────────────────────
function validateAll() {
  let errors = 0;
  for (const category of CATEGORIES) {
    for (const level of LEVELS) {
      const filePath = path.join(OUTPUT_DIR, category, `level-${level}.json`);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing: ${filePath}`);
        errors++;
        continue;
      }
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data.forEach((q, i) => {
        if (!q.id || !q.question || !q.options || q.options.length !== 4) {
          console.error(`❌ Invalid question at ${category}/${level}[${i}]: missing fields`);
          errors++;
        }
        if (q.correct < 0 || q.correct > 3) {
          console.error(`❌ Invalid correct answer at ${category}/${level}[${i}]: ${q.correct}`);
          errors++;
        }
      });
      console.log(`  ✅ ${category}/${level} — ${data.length} questions valid`);
    }
  }
  console.log(errors === 0 ? '\n🎉 All questions valid!' : `\n⚠️ Found ${errors} errors`);
}

// ─────────────────────────────────────────
// CLI
// ─────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes('--validate')) {
  console.log('🔍 Validating all question banks...\n');
  validateAll();
} else {
  console.log('🚀 Generating question banks for all categories and levels...\n');
  generateAllQuestions();
}
