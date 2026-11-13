# Dutch text review: suggestions for Dr. Balikova

**Nothing in the source files has been changed.** This is a list of what I found and what I suggest. The doctor decides, and the site will use her decisions.

- **Scope:** the Dutch texts of Home, Over mij, Klinieken, FAQ and the four articles. The EN and FR texts were not checked, since the README says the doctor has reviewed them.
- **Not checked:** medical accuracy. I only mark places where I could not tell what was meant.
- **Locations:** `file:line` refers to `design/content/<file>.md` (line numbers as in the repo today). "Site" means a text that is on the page itself (not in a `.md` file).

**Type:** **S** = spelling or typo, **G** = grammar or wording, **C** = unclear or content to confirm by the doctor, **F** = formatting or consistency.

---

## 1. Texts outside the articles (Home, Over mij, FAQ, Klinieken)

| # | Where | Current | Suggestion | Type |
|---|---|---|---|---|
| 1.1 | Home, step 3 title | Petje/Zonnenbril | Petje/zonnebril (also: sentence case, like the other titles) | S |
| 1.2 | Home, step 3 text | Een petje en of zonnenbril kunnen helpen | Een petje en/of zonnebril kunnen helpen | S |
| 1.3 | Home, step 1 text | tenminste 30 minuten | ten minste 30 minuten (or "minstens", as on the Klinieken page) | S |
| 1.4 | Over mij, tag "Specialisatie" | Strabismechirurgie | Strabismuschirurgie (as in the text "Wat ik behandel") | S |
| 1.5 | Home, chip | Myopie management | Myopiemanagement (one word in Dutch). Low priority | S |
| 1.6 | Home, hero title | Kinderoogheelkunde consultaties | Dutch compounds are written as one word, so "Kinderoogheelkundeconsultaties" (long) or "Consultaties kinderoogheelkunde". **Already approved by the doctor, so only change if she wants.** | G |
| 1.7 | Home vs. articles page, card of the strabismus article | Home: "De signalen, en wanneer het dringend is." Articles page: "De symptomen, de stappen en wanneer het dringend is." | Use one version in both places | F |
| 1.8 | Strabismus card vs. article text | Card: "komt voor bij 5%". Article: "onstaat bij 5%" | "Komt voor" (prevalence) and "ontstaat" (incidence) mean different things. Doctor to decide which is meant | C |
| 1.9 | FAQ, "Wat is het verschil tussen een lui oog en scheelzien?" | "Omgekeerd kan een oog met een ernstig lui oog ook gaan scheelzien." | "Omgekeerd kan een ernstig lui oog ook gaan scheelzien." (an eye cannot have a lazy eye) | G |
| 1.10 | Klinieken, Aarschot | Website shown as rztienen.be | This matches the brief, but the clinic is called "Medisch Centrum Aarschot". Please confirm the link text should stay rztienen.be | C |

---

## 2. Article: Zorgtraject Myopie (`zorgpad-myopie.md`)

| # | Line | Current | Suggestion | Type |
|---|---|---|---|---|
| 2.1 | 6 | bij de boek zitten | bij het boek zitten | G |
| 2.2 | 10 | Risico factoren | Risicofactoren | S |
| 2.3 | 13 | scherm gebruik : tablets | schermgebruik: tablets (no space before a colon) | S |
| 2.4 | 22 | Axiale lengte meting | Axiale lengtemeting | S |
| 2.5 | 27 | Myopie bij kinderen <2jaar | Myopie bij kinderen jonger dan 2 jaar | F |
| 2.6 | 29 | sympromzn | symptomen | S |
| 2.7 | 29 | Geassocieerde atypische  visuele klachten (double space) | Remove the double space | F |
| 2.8 | 30 | Verminderd zicht in het donker, doet altijd het licht aan…) | There is a closing bracket but no opening one. Suggest: "Verminderd zicht in het donker (het kind doet altijd het licht aan)" | G |
| 2.9 | 32 and 34 | "Veel botsen bij verplaatsingen" appears twice | Remove one | F |
| 2.10 | 33 | gehoor verlies bij de kind of de familie | gehoorverlies bij het kind of in de familie | S/G |
| 2.11 | 33 | haart problemen | haarproblemen | S |
| 2.12 | 33 | grote gestalte met T span | **Unclear.** What is "T span"? (armspanwijdte?) Doctor to confirm | C |
| 2.13 | 33 | Hyperlaxiteit | Fine as a medical term. Optional parent-friendly addition: "(overbeweeglijke gewrichten)" | G |
| 2.14 | 37 | leefstijl advies | leefstijladvies | S |
| 2.15 | 38 | pauses maken, vodoende afstand | pauzes maken, voldoende afstand; "scherm gebruik" becomes "schermgebruik" | S |
| 2.16 | 38 | >2 uur buitentijd | "meer dan 2 uur buitentijd" | F |
| 2.17 | 40 | Myopie-control brillenglazen (DIMS, HALT) | Brillenglazen voor myopiecontrole (DIMS, HALT) | G |
| 2.18 | 41 | Miyosmart contact lensen | "contactlenzen" (one word). **Please verify the product:** as far as I know MiyoSmart is a *spectacle* lens (DIMS technology), and the usual myopia-control *contact* lens is MiSight. Doctor to confirm which is meant | S + C |
| 2.19 | 43 | lage dosis atropine oogdruppels | oogdruppels met een lage dosis atropine (0,02–0,05%) | G |
| 2.20 | 6–13, 17–19, 22–24 | Some bullets end with a full stop, others do not | Choose one style for all bullets | F |
| 2.21 | 8, 12 | "Hoofdpijn of oogvermoeidheid bij lezen", "Aziatische afkomst" (no full stop) | Same as 2.20 | F |

---

## 3. Article: Zorgtraject Strabisme (`zorgtraject-strabisme.md`)

This one has the most errors. Most are spelling.

| # | Line | Current | Suggestion | Type |
|---|---|---|---|---|
| 3.1 | 3 | Strabisme onstaat | ontstaat | S |
| 3.2 | 3 | risico factoren | risicofactoren | S |
| 3.3 | 3 | refractie afwijkingen | refractieafwijkingen | S |
| 3.4 | 3 | amblyopia | amblyopie (as in the other articles) | S |
| 3.5 | 3 | tauma | trauma | S |
| 3.6 | 7 | (Alarm) Symptomen bij strabisme | Alarmsymptomen bij strabisme | G |
| 3.7 | 12 | Asthenopie – hoofdpijn na visuele werk, moelijkheden bij lezen | Asthenopie: hoofdpijn na visueel werk, moeilijkheden bij het lezen | S/G |
| 3.8 | 14 | Etapen van de zorgtraject | Etappes van het zorgtraject | S/G |
| 3.9 | 15 | Kind en Gezin,CLB,  Huisartsen, … familiale risico | Kind en Gezin, CLB, huisartsen; "familiaal risico" (space after comma, lowercase, one space) | S/F |
| 3.10 | 17, 19 | plots onstaan (2 times) | plots ontstaan | S |
| 3.11 | 19 | braken en esotropia | braken en esotropie | S |
| 3.12 | 19 | constante strabisme | constant strabisme ("het strabisme") | G |
| 3.13 | 19 | reflet van de straberende oog | **Unclear wording.** "reflet" is French and "straberende" is not a Dutch word. Suggest "lichtreflex van het scheelstaande oog" if that is what is meant. Doctor to confirm | C |
| 3.14 | 20 | Semi dringend | Semidringend or semi-dringend | S |
| 3.15 | 20 | risico voor amblyopia, Graves | risico op amblyopie, ziekte van Graves | S/G |
| 3.16 | 20 | intermittente strabisme veranderd naar permanente strabisme | intermitterend strabisme dat permanent wordt | G |
| 3.17 | 21 | lang bestande strabisme | langbestaand strabisme | S |
| 3.18 | 28 | Het oogstand werdt beordeld met  covertest | De oogstand wordt beoordeeld met een covertest | S/G |
| 3.19 | 29 | Binocculaire | Binoculaire | S |
| 3.20 | 30 | Beordeling van de occulaire dominantie | Beoordeling van de oculaire dominantie | S |
| 3.21 | 31 | Deviometrie meting | Deviatiemeting (or just "Deviometrie") | S |
| 3.22 | 31 | synoptophoor | synoptofoor (Dutch spelling). Please confirm | S |
| 3.23 | 32 | Meting van de stereozicht met test van Lang | Meting van het stereozicht met de Lang-test | G |
| 3.24 | 34 | Hess scherm … volwassenen patiënten | Het Hess-scherm … volwassen patiënten | G |
| 3.25 | 34 | differentiele diagnose; restrictive; comittante strabisme | differentiële diagnose; restrictief; concomitant strabisme | S |
| 3.26 | 36 | Cyclogil 0,5% of cyclogil 1% | Cyclogyl 0,5% of 1% (this is the brand spelling; please confirm) | S |
| 3.27 | 36 | De cycloplegie onstaat 30 minuten na … Pas nadat kan … | "ontstaat". "Pas nadat" is an unfinished sentence, suggest "Pas daarna kan de cycloplegische refractie gemeten worden." | S/G |
| 3.28 | 43 | Botulinum toxin injectie | Injectie met botulinumtoxine | S |
| 3.29 | 45 | Tijdige detectie (red flags) - > doorverwijzing naar strabisme raadpleging - >diagnostic -> behandeling - > opvolging | Use proper arrows (→) and Dutch words: "diagnostiek"; "strabismeconsultatie"; "(alarmsignalen)" instead of the English "red flags" | S/F |
| 3.30 | 19 | 📢 Red flags | The site shows the label "Alarmsignalen" (README). In the text file the label is English and has an emoji. The label will be a field in the CMS, so no change needed in the text | F |
| 3.31 | 1 | Trailing space after the title | Remove | F |

---

## 4. Article: Zorgtraject Amblyopie (`zorgpad-amblyopie.md`)

| # | Line | Current | Suggestion | Type |
|---|---|---|---|---|
| 4.1 | 5 | De amblyopie onstaat in de vroege kinderjaren. | ontstaat | S |
| 4.2 | 5 | De kritische periode van visuele ontwikkeling. | **Not a full sentence.** Suggest "Dit is de kritische periode van de visuele ontwikkeling." | G |
| 4.3 | 5 | Het begin van deze periode is vanaf de geboorte en loopt tot 10 jaar. | "Deze periode begint bij de geboorte en loopt tot ongeveer 10 jaar." | G |
| 4.4 | 5 | process; uni of bilaterale | proces; unilaterale of bilaterale amblyopie (or "uni- of bilaterale") | S |
| 4.5 | 17 | is vaak gemist … onstaan bij binocculair zicht | wordt vaak gemist … ontstaan bij binoculair zicht | S/G |
| 4.6 | 17 and 24 | The same statement is made twice: "Unilaterale amblyopie … gemist door de omgeving" | Keep once, or confirm that the repeat (with "!") is intended | F |
| 4.7 | 28 | Afwijkend screening test | Afwijkende screeningtest | G |
| 4.8 | 29 | Afwijkend rood reflet | Afwijkende rode reflex | S |
| 4.9 | 11 and 31 | congenitaal cataract (line 11), aangeboren cataract (line 31) | Use one term, for parents "aangeboren cataract" | F |
| 4.10 | 34 | visusmeting leeftijdsadequaat | leeftijdsadequate visusmeting | G |
| 4.11 | 41 | Vaak verbetert visus na 4–12 weken al sterk. | Vaak verbetert de visus al sterk na 4–12 weken. | G |
| 4.12 | 44 | "Duur/intensiteit afhankelijk van leeftijd en ernst:" | **The colon announces a list that is missing.** Was something left out (durations or schedule)? Doctor to confirm | C |
| 4.13 | 45 | Alternatief bij complianceproblemen | "therapietrouw" is used further down (line 65). Use one term, "therapietrouw" is the more parent-friendly | F |
| 4.14 | 53 | Tot stabilisatie en visusmaximalisatie bereikt is | Tot de visus gestabiliseerd en maximaal is | G |
| 4.15 | 52 | belangrijke risico factoren | risicofactoren | S |
| 4.16 | 57 | stereozien | stereozicht | S |
| 4.17 | 67 | social moelijke gezinnen | sociaal moeilijke gezinnen | S |

---

## 5. Article: Pseudostrabisme (`pseudostrabisme-bij-kinderen.md`)

This article is cleanest. Most issues are missing spaces after full stops.

| # | Line | Current | Suggestion | Type |
|---|---|---|---|---|
| 5.1 | 19 | Nee.👉 Pseudostrabisme | Nee. Pseudostrabisme … (space; the 👉 and 📅 emoji need a design decision, see below) | F |
| 5.2 | 22 | in de meeste gevallen wel.Naarmate | wel. Naarmate | F |
| 5.3 | 26 | behandeling.Daarom | behandeling. Daarom | F |
| 5.4 | 34 | wanneer een kind één oog lijkt te voorkeuren | "voorkeuren" is not a verb here. Suggest: "wanneer een kind een voorkeur lijkt te hebben voor één oog" | G |

---

## 6. Points that need a decision (not typos)

1. **Emoji in article text** (📢 👉 📅). They are in the source texts. I suggest not showing them on the site (the design uses illustrated characters instead). Is that OK?
2. **Bullet punctuation.** One style for all bullets (with or without full stop).
3. **English medical words in Dutch text:** "red flags", "compliance", "follow-up". For parents, Dutch alternatives are friendlier (alarmsignalen, therapietrouw, opvolging). Only if the doctor agrees.
4. **Sub-bullets.** The source uses `>` for sub-bullets. In production they become real nested lists.

---

## Summary

| Type | Count |
|---|---|
| Spelling / typos (S) | about 55 |
| Grammar / wording (G) | about 25 |
| Unclear or to confirm by the doctor (C) | 6 (items 1.8, 1.10, 2.12, 2.18, 3.13, 4.12), plus 2 spelling checks (3.22 and 3.26) |
| Formatting / consistency (F) | about 15 |

**The six "C" items are the ones only the doctor can answer.** The counts above are approximate.
