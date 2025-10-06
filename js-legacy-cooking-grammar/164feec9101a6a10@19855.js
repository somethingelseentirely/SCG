// https://observablehq.com/@port/cooking-grammar@19855
import define1 from "./9ab13ccf3341b8fb@20186.js";

function _1(md){return(
md`# Cooking Grammar ☕️`
)}

function _2(md){return(
md`The following cell controls which cxns are contained in the grammar.  
Warning: including all cxns will result in longer loading times.`
)}

function _cookingGrammar(grammar,cookingNS,wordFormSourceCxn,extractInitialSceneFromSimCxn,groundInitialSchemasCxn,determinerCxn,nounCxn,massNounNPCxn,determinedNounNPCxn,verbCxn,prepCxn,conjCxn,pronounCxn,vpCxn,unexpressedTransitiveCxn,transitiveCxn,discourseAddresseeImplicitSubjectCxn,imperativeCxn,ppCxn,npLocativeOnPPCxn,locativeOffPPCxn,locativeOnPPCxn,locativeToPPCxn,causedMotionCxn,initialSchemasCxn){return(
grammar(
  cookingNS,
  [wordFormSourceCxn,
   extractInitialSceneFromSimCxn
  ],
  [
    groundInitialSchemasCxn,
    determinerCxn,
    nounCxn,
    massNounNPCxn,
    determinedNounNPCxn,
    verbCxn,
    prepCxn,
    conjCxn,
    ////adverbCxn,
    pronounCxn,
    // corefCxn,
    // adjectiveCxn,
    // adjectiveNeedingCxn,
    ////adjectiveDesiringCxn,
    vpCxn,
    unexpressedTransitiveCxn,
    transitiveCxn,
    discourseAddresseeImplicitSubjectCxn,
    imperativeCxn,
    ppCxn,
    npLocativeOnPPCxn,
    locativeOffPPCxn,
    locativeOnPPCxn,
    locativeToPPCxn,
    ////intoPPAdjunctPathCxn,
    causedMotionCxn,
    initialSchemasCxn,
    // ifAdjNeedClauseCxn,
    ////ifAdjDesireClauseCxn,
    //intoPropertyResultativeCxn,
    // untilAdjPostconditionCxn,
    // containedPPCxn,
    // instrumentalPPProcessCxn,
    // coveringCxn,
    ////shapeQualityAdverbCxn,
    // commandAndLinkCxn,
    // commandThenLinkCxn
  ]
)
)}

function _cookingKB(withLexicon,tribles,cookingLexicon){return(
withLexicon(
  new tribles.KB(new tribles.MemTribleDB(), new tribles.MemBlobDB()),
  cookingLexicon
)
)}

function _5(md){return(
md`🚧 Schema Evocations inside Cxns 🚧`
)}

function _ids(tribles){return(
tribles.UFOID.namedCache()
)}

function _attrNames(cookingNS){return(
new Map(Object.entries(cookingNS).map(([k, v]) => [v.id, k]))
)}

function _cookingNS(tribles,lexInvariants,lexNamespace,wordNamespace)
{
  tribles.globalInvariants(lexInvariants);
  return tribles.namespace(lexNamespace, wordNamespace);
}


function _wordNS(tribles,wordNamespace){return(
tribles.namespace(wordNamespace)
)}

function _lexNamespace(tribles,ids){return(
{
  [tribles.id]: tribles.types.ufoid,
  "scg/eventType": {
    id: ids.scgEventType,
    ...tribles.types.shortstring
  },
  "scg/pos": {
    id: ids.scgPos,
    ...tribles.types.shortstring
  },
  "cg/sem-function": {
    id: ids.cgSemFunction,
    ...tribles.types.longstring
  },
  "cg/semantic-size": {
    id: ids.cgSemanticSize,
    ...tribles.types.shortstring
  },
  "soma/Quality": { id: ids.somaQuality },
  "soma/Instrument": { id: ids.somaInstrument },
  "soma/Patient": { id: ids.somaPatient },
  "soma/AgentRole": { id: ids.somaAgentRole },
  "scg/classifies": { id: ids.scgClassifies },
  "soma/hasPart": { id: ids.somaHasPart },
  "soma/expresses": { id: ids.somaExpresses },
  "soma/isExpressedBy": { id: ids.somaIsExpressedBy },
  "soma/hasTerminalScene": { id: ids.somaHasTerminalScene },
  "soma/hasInitialScene": { id: ids.somaHasInitialScene },
  "soma/precedes": { id: ids.somaPrecedes },
  "dul/satisfies": { id: ids.dulSatisfies },
  "cg/subject": { id: ids.cgSubject },
  "cg/agent": { id: ids.cgAgent },
  "cg/form": {
    id: ids.cgForm,
    ...tribles.types.shortstring
  },
  "cg/object": { id: ids.cgObject },
  "cg/patient": { id: ids.cgPatient },
  "rdfs/subClassOf": {
    id: ids.rdfsSubClassOf,
    ...tribles.types.shortstring
  },
  "rdfs/class": {
    id: ids.rdfsClass,
    ...tribles.types.shortstring
  },
  "rdf/type": {
    id: ids.rdfType,
    ...tribles.types.shortstring
  },
  "cg/definiteness": {
    id: ids.cgDefiniteness,
    ...tribles.types.shortstring
  },
  "dul/defines": { id: ids.dulDefines },
  "cg/identifiability": {
    id: ids.cgIdentifiability,
    ...tribles.types.shortstring
  },
  "cg/synValence": { id: ids.cgSynValence },
  "cg/head": { id: ids.cgHead },
  "scg/schema": { id: ids.scgSchema },
  "scg/evokes": {
    id: ids.scgEvokes,
    ...tribles.types.shortstring
  },
  "cg/tense": {
    id: ids.cgTense,
    ...tribles.types.shortstring
  },
  "cg/sceneState": {
    id: ids.cgSceneState,
    ...tribles.types.shortstring
  },
  "cg/hasNumberValue": {
    id: ids.cgHasNumberValue,
    ...tribles.types.shortstring
  },
  "dul/classifies": { id: ids.dulClassifies },
  "li/numerus": {
    id: ids.liNumerus,
    ...tribles.types.shortstring
  },
  "cg/pos": {
    id: ids.cgPos,
    ...tribles.types.shortstring
  },
  "scg/word": { id: ids.scgWord },
  "cg/lexicon": { id: ids.cgLexicon },
  "cg/subunit": { id: ids.cgSubunit },
  "cg/agreement": {
    id: ids.cgAgreement,
    ...tribles.types.shortstring
  },
  "cg/semValence": { id: ids.cgSemValence },
  "cg/referent-det": {
    id: ids.cgDetReferent,
    isInverse: true
  },
  "cg/prepId": {
    id: ids.cgPrepId,
    ...tribles.types.shortstring  },
  "cg/det-referent": { id: ids.cgDetReferent },
  "cg/referent": { id: ids.cgReferent },
  "scg/isa": {
    id: ids.scgIsa,
    ...tribles.types.shortstring
  },
  // Akin to SBCG's `FORM` for passing up information about a specific wordform, e.g. prepositions or conjunctions.
  "scg/form": {
    id: ids.scgForm,
    ...tribles.types.shortstring
  },
  "scg/schemaName": {
    id: ids.scgSchemaName,
    ...tribles.types.shortstring
  },
  "scg/PPAttachedTo": {
    id: ids.scgPPAttachedTo
  },
  "scg/groundedTo": {
    id: ids.scgGroundedTo
},
  "scg/providedBy": {
     id: ids.scgProvidedBy,
    ...tribles.types.shortstring
}
}
)}

function _lexInvariants(ids){return(
{
  [ids.scgGroundedTo]: { isUnique: true, isLink: true },
  [ids.scgSchemaName]: { isUnique: true },
  [ids.scgPos]: { isUnique: true },
  [ids.scgSchema]: { isLink: true, isUnique: true },
  [ids.scgEventType]: { isUnique: true },
  [ids.cgSemFunction]: { isUnique: true },
  [ids.cgSemanticSize]: { isUnique: true },
  [ids.somaQuality]: { isLink: true, isUnique: true },
  [ids.somaInstrument]: { isLink: true, isUnique: true },
  [ids.somaPatient]: { isLink: true, isUnique: true },
  [ids.somaAgentRole]: { isLink: true, isUnique: true },
  [ids.scgClassifies]: { isLink: true, isUnique: true },
  [ids.somaHasPart]: { isLink: true },
  [ids.somaExpresses]: { isLink: true, isUnique: true, isUniqueInverse: true },
  [ids.somaIsExpressedBy]: { isLink: true, isUnique: true },
  [ids.somaHasTerminalScene]: { isLink: true, isUnique: true },
  [ids.somaHasInitialScene]: { isLink: true, isUnique: true },
  [ids.somaPrecedes]: { isLink: true },
  [ids.dulSatisfies]: { isLink: true },
  [ids.cgSubject]: { isLink: true, isUnique: true },
  [ids.cgAgent]: { isLink: true, isUnique: true },
  [ids.cgForm]: { isUnique: true },
  [ids.cgObject]: { isLink: true, isUnique: true },
  [ids.cgPatient]: { isLink: true, isUnique: true },
  [ids.cgClauseType]: { isUnique: true },
  [ids.rdfsSubClassOf]: { isUnique: true },
  [ids.rdfsClass]: { isUnique: true },
  [ids.rdfType]: { isUnique: true },
  [ids.cgDefiniteness]: { isUnique: true },
  [ids.dulDefines]: { isLink: true, }, //TODO isInverseUnique ?
  [ids.cgIdentifiability]: { isUnique: true },
  [ids.cgSynValence]: { isLink: true, isUnique: true, isUniqueInverse: true },
  [ids.cgHead]: { isLink: true, isUnique: true },
  [ids.scgEvokes]: { isLink: true }, //TODO isInverseUnique ?
  [ids.cgTense]: { isUnique: true },
  [ids.cgSceneState]: { isUnique: true },
  [ids.cgHasNumberValue]: { isUnique: true },
  [ids.dulClassifies]: { isLink: true, isUnique: true },
  [ids.liNumerus]: { isUnique: true },
  [ids.cgPos]: { isUnique: true },
  [ids.scgMeets]: { isLink: true, isUnique: true },
  [ids.scgWord]: { isLink: true, isUnique: true, isUniqueInverse: true },
  [ids.cgPrepId]: { isUnique: true },
  [ids.cgLexicon]: { isLink: true, isUnique: true },
  [ids.cgSubunit]: { isLink: true, isUniqueInverse: true }, //TODO isInverseUnique ?
  [ids.cgAgreement]: { isUnique: true },
  [ids.cgSemValence]: { isLink: true, isUnique: true, isUniqueInverse: true },
  [ids.cgDetReferent]: {
    isLink: true,
    isUnique: true,
    isUniqueInverse: true
  },
  [ids.cgReferent]: { isLink: true, isUnique: true },
  [ids.scgIsa]: { isUnique: true },
  [ids.scgForm]: { isUnique: true },
  [ids.scgPPAttachedTo]: { isLink: true, isUnique: true },
  [ids.scgGrounded]: { isUnique: true },
  [ids.scgProvidedBy]: { isUnique: true }
}
)}

function _withLexicon(tribles,cookingNS){return(
(kb, lexicon) => {
  for (const lexEntry of lexicon) {
    const lexEntity = lexEntry[tribles.id] ?? tribles.UFOID.now();

    kb = kb.with(cookingNS, ([]) => [
      {
        [tribles.id]: lexEntity,
        ...lexEntry,
        tag: ["scg/lex"]
      }
    ]);
  }

  return kb;
}
)}

function _cookingLexicon(ids,tribles){return(
[
  {
    "scg/form": "cut",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.cuttingTheory]
  },
  {
    "scg/form": "slice",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.cuttingTheory]
  },
  {
    [tribles.id]: ids.cuttingTheory,
    "rdf/type": "soma/CuttingTheory",
    // Actually sth like "defines": some event that has": event type": ModifyingPhysicalObject",
    "scg/eventType": "soma/ModifyingPhysicalObject",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": ids.cuttingPatient, //tribles.UFOID.now(),
    "soma/Instrument": tribles.UFOID.now()
  },
  {
    [tribles.id]: ids.cuttingPatient,
    "rdf/type": "soma/Ingredient"
  },
  { "rdf/type": "soma/Pieces", "soma/Quality": tribles.UFOID.now() },
  {
    "scg/form": "whisk",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.whiskingTheory]
  },
  {
    [tribles.id]: ids.whiskingTheory,
    "rdf/type": "soma/WhiskingTheory",
    "scg/eventType": "soma/ModifyingPhysicalObject",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now(),
    "soma/Instrument": tribles.UFOID.now()
  },
  {
    "scg/form": "fill",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.fillingTheory]
  },
  {
    [tribles.id]: ids.fillingTheory,
    "rdf/type": "soma/FillingTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "empty",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.emptyingTheory]
  },
  {
    [tribles.id]: ids.emptyingTheory,
    "rdf/type": "soma/EmptyingTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "rinse",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.rinsingTheory]
  },
  {
    [tribles.id]: ids.rinsingTheory,
    "rdf/type": "soma/RinsingTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "wait",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.waitingTheory]
  },
  {
    [tribles.id]: ids.waitingTheory,
    "rdf/type": "soma/WaitingTheory",
    "soma/AgentRole": tribles.UFOID.now()
  },
  {
    "scg/form": "turn",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.turningTheory]
  },
  {
    [tribles.id]: ids.turningTheory,
    "rdf/type": "soma/TurningTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "rotate",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.turningTheory]
  },
  {
    "scg/form": "take",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.takingTheory]
  },
  {
    [tribles.id]: ids.takingTheory,
    "rdf/type": "soma/TakingTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "pour",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.pouringTheory]
  },
  {
    [tribles.id]: ids.pouringTheory,
    "rdf/type": "soma/PouringTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "place",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.placingTheory]
  },
  {
    "scg/form": "put",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.placingTheory]
  },
  {
    [tribles.id]: ids.placingTheory,
    "rdf/type": "soma/PlacingTheory",
    "rdf/type": "soma/Placing",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "store",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.storingTheory]
  },
  {
    [tribles.id]: ids.storingTheory,
    "rdf/type": "soma/StoringTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "bring",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.bringingTheory]
  },
  {
    [tribles.id]: ids.bringingTheory,
    "rdf/type": "soma/BringingTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "crack",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.crackingTheory]
  },
  {
    [tribles.id]: ids.crackingTheory,
    "rdf/type": "soma/CrackingTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "move",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.movingTheory]
  },
  {
    [tribles.id]: ids.movingTheory,
    "rdf/type": "soma/MovingTheory",
    "soma/AgentRole": tribles.UFOID.now()
  },
  {
    "scg/form": "cover",
    "cg/pos": "soma/V",
    "cg/agreement": "freeAgreement",
    "cg/tense": "cg/present",
    "scg/evokes": [ids.coveringTheory]
  },
  {
    [tribles.id]: ids.coveringTheory,
    "rdf/type": "soma/CoveringTheory",
    "soma/AgentRole": tribles.UFOID.now(),
    "soma/Patient": tribles.UFOID.now()
  },
  {
    "scg/form": "the",
    "cg/pos": "soma/DET",
    "li/numerus": "unspecified",
    "cg/definiteness": "cg/definite"
  },
  {
    "scg/form": "a",
    "cg/pos": "soma/DET",
    "li/numerus": "li/Singular",
    "cg/definiteness": "cg/indefinite"
  },
  {
    "scg/form": "pot",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "soma/Pot",
    "cg/semantic-size": "soma/medium"
  },
  {
    "scg/form": "cup",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "home/Cup",
    "cg/semantic-size": "cg/small"
  },
  {
    "scg/form": "bowl",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "soma/Bowl",
    "cg/semantic-size": "soma/medium"
  },
  {
    "scg/form": "pan",
    "cg/pos": "soma/N",
    "rdf/type": "soma/Pan",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "eggs",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Egg",
    "li/numerus": "li/Plural"
  },
  {
    "scg/form": "water",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Water",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "apple",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Apple",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "cucumber",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Cucumber",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "cucumbers",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Cucumber",
    "li/numerus": "li/Plural"
  },
  {
    "scg/form": "dough",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Dough",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "tomatoes",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Tomato",
    "li/numerus": "li/Plural"
  },
  {
    "scg/form": "cups",
    "cg/pos": "soma/N",
    "li/numerus": "li/Plural",
    "rdf/type": "home/Cup",
    "cg/semantic-size": "cg/small"
  },
  {
    "scg/form": "sink",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "ext/Sink",
    "cg/semantic-size": "cg/big"
  },
  {
    "scg/form": "fridge",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "soma/Refrigerator",
    "cg/semantic-size": "cg/large"
  },
  {
    "scg/form": "refrigerator",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "soma/Refrigerator",
    "cg/semantic-size": "cg/large"
  },
  {
    "scg/form": "pieces",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Piece",
    "li/numerus": "li/Plural"
  },
  {
    "scg/form": "strips",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Strip",
    "li/numerus": "li/Plural"
  },
  { "scg/form": "if", "cg/pos": "soma/CONJ" },
  {
    "scg/form": "from",
    "cg/pos": "soma/PREP",
    "cg/sem-function": "soma/GeneralDirectionalDistancing"
  },
  { "scg/form": "into", "cg/pos": "soma/PREP" },
  { "scg/form": "with", "cg/pos": "soma/PREP" },
  {
    "scg/form": "lid",
    "cg/pos": "soma/N",
    "rdf/type": "soma/Lid",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "knife",
    "cg/pos": "soma/N",
    "rdf/type": "soma/Knife",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "fork",
    "cg/pos": "soma/N",
    "rdf/type": "soma/Fork",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "tongs",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Tong",
    "li/numerus": "li/Plural"
  },
  {
    "scg/form": "spoon",
    "cg/pos": "soma/N",
    "rdf/type": "ext/SpooN",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "table",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "soma/Table"
  },
  {
    "scg/form": "shelf",
    "cg/pos": "soma/N",
    "li/numerus": "li/Singular",
    "rdf/type": "ext/Shelf"
  },
  {
    "scg/form": "light",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Light",
    "li/numerus": "li/Singular"
  },
  {
    "scg/form": "leftovers",
    "cg/pos": "soma/N",
    "rdf/type": "ext/Leftover",
    "li/numerus": "li/Plural"
  },
  { "scg/form": "off", "cg/pos": "soma/PREP" },
  { "scg/form": "to", "cg/pos": "soma/PREP" },
  {
    "scg/form": "counter",
    "li/numerus": "li/Singular",
    "cg/pos": "soma/N",
    "rdf/type": "soma/CounterTop"
  },
  { "scg/form": "on", "cg/pos": "soma/PREP" },
  { "scg/form": "until", "cg/pos": "soma/PREP" },
  { "scg/form": "and", "cg/pos": "soma/CONJ" },
  {
    "scg/form": "it",
    "li/numerus": "li/Singular",
    "cg/pos": "soma/PPRON"
  },
  {
    "scg/form": "smooth",
    "cg/pos": "soma/ADJ",
    "rdf/type": "dul/Quality"
  },
  {
    "scg/form": "needed",
    "rdf/type": "soma/Needing",
    "cg/pos": "soma/ADJ"
  },
  {
    "scg/form": "desired",
    "rdf/type": "soma/Desiring",
    "cg/pos": "soma/ADJ"
  },
  {
    "scg/form": "thinly",
    "rdf/type": "soma/ShapeQuality",
    "cg/pos": "soma/ADV"
  },
  { "rdfs/class": "soma/Fork", "rdfs/subClassOf": "soma/Instrument" },
  { "rdfs/class": "soma/Lid", "rdfs/subClassOf": "soma/Instrument" },
  {
    "rdfs/class": "soma/Knife",
    "rdfs/subClassOf": "soma/Instrument"
  },
  { "rdfs/class": "ext/Spoon", "rdfs/subClassOf": "soma/Instrument" },
  { "rdfs/class": "ext/Tong", "rdfs/subClassOf": "soma/Instrument" },
  {
    "rdfs/class": "ext/Cucumber",
    "rdfs/subClassOf": "soma/Ingredient"
  },
  { "rdfs/class": "ext/Dough", "rdfs/subClassOf": "soma/Ingredient" },
  {
    "rdfs/class": "ext/Cucumber",
    "rdfs/subClassOf": "soma/Ingredient"
  },
  { "rdfs/class": "ext/Egg", "rdfs/subClassOf": "soma/Ingredient" },
  { "rdfs/class": "ext/Water", "rdfs/subClassOf": "soma/Ingredient" },
  { "rdfs/class": "ext/Apple", "rdfs/subClassOf": "soma/Ingredient" },
  {
    "rdfs/class": "ext/Tomato",
    "rdfs/subClassOf": "soma/Ingredient"
  },
  {
    "rdfs/class": "soma/CounterTop",
    "rdfs/subClassOf": "soma/Surface"
  },
  { "rdfs/class": "soma/Table", "rdfs/subClassOf": "soma/Surface" },
  { "rdfs/class": "ext/Shelf", "rdfs/subClassOf": "soma/Surface" },
  {
    "rdfs/class": "soma/Pot",
    "rdfs/subClassOf": "soma/DesignedContainer"
  },
  {
    "rdfs/class": "home/Cup",
    "rdfs/subClassOf": "soma/DesignedContainer"
  },
  {
    "rdfs/class": "soma/Bowl",
    "rdfs/subClassOf": "soma/DesignedContainer"
  },
  {
    "rdfs/class": "soma/Pan",
    "rdfs/subClassOf": "soma/DesignedContainer"
  },
  {
    "rdfs/class": "ext/Sink",
    "rdfs/subClassOf": "soma/DesignedContainer"
  },
  {
    "rdfs/class": "soma/Refrigerator",
    "rdfs/subClassOf": "soma/DesignedContainer"
  },
  { "rdfs/class": "ext/Piece", "rdfs/subClassOf": "soma/Shape" },
  { "rdfs/class": "ext/Strip", "rdfs/subClassOf": "soma/Shape" }
]
)}

function _lexById(cookingLexicon){return(
() =>
  function(id) {
    return cookingLexicon.groupBy(entry => entry.get('id')).get(id);
  }
)}

function _lexByForm(cookingLexicon){return(
() =>
  function(form) {
    return cookingLexicon.groupBy(entry => entry.get('scg/form')).get(form);
  }
)}

function _16(md){return(
md`## Source Constructions`
)}

function _17(md){return(
md`### WordForm`
)}

function _wordFormSourceCxn(tribles){return(
{
  cxnId: "wordForm",
  query: ({ oldKB, difKB, newKB }, { wordEntity, wordForm, pos, lexId, startIndex, endIndex }) => [
    difKB.where([
      {
        [tribles.id]: wordEntity,
        wordForm,
        tag: ["scg/word"],
        startIndex,
        endIndex
      }
    ]),
    newKB.where([
      {
        [tribles.id]: lexId,
        "scg/form": wordForm,
        "cg/pos": pos
      }
    ])
  ],
  merging: ({ interpretation, wordEntity, pos, lexId, startIndex, endIndex }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "scg/pos": pos,
      "cg/lexicon": lexId,
      "scg/word": wordEntity,
      startIndex,
      endIndex
    }
  ]
}
)}

function _19(md){return(
md`### Context: ExtractFunctionalRelations`
)}

function _extractInitialSceneFromSimCxn(tribles){return(
{
  cxnId: "extractInitialSceneFromSim",
  query: (
    { oldKB, difKB, newKB },
    {
      schema,
      supporter,
      supportee,
      relatum,
      locatum,
      supporterType,
      supporteeType,
    }
  ) => [
    difKB.where([
      {
        [tribles.id]: schema,
        "scg/isa": "soma/SchemaTheory",
        "scg/schemaName": "soma/SupportTheory",
        "dul/defines": [relatum, locatum],
      },
    ]),
    newKB.where([
      {
        [tribles.id]: relatum,
        "scg/isa": "soma/RelatumRole",
        "dul/classifies": {
          [tribles.id]: supporter,
          // "scg/isa": "scg/SceneObject",
          "scg/isa": "li/Referent",
          "rdf/type": supporterType,
        },
      },
      {
        [tribles.id]: locatum,
        "scg/isa": "soma/LocatumRole",
        "dul/classifies": {
          [tribles.id]: supportee,
          // "scg/isa": "scg/SceneObject",
          "scg/isa": "li/Referent",
          "rdf/type": supporteeType,
        },
      },
    ]),
  ],
  merging: (v) => [
    {
      [tribles.id]: v.simScene,
      "scg/isa": "soma/Scene",
      "cg/sceneState": "cg/initial",
      "dul/satisfies": [
        {
          [tribles.id]: v.schema,
          "scg/isa": "soma/SchemaTheory",
          "scg/providedBy": "scg/Simulation",
          "scg/schemaName": "soma/SupportTheory",
          "dul/defines": [v.relatum, v.locatum],
        },
      ],
    },
    {
      [tribles.id]: v.relatum,
      "scg/isa": "soma/RelatumRole",
      "dul/classifies": {
        [tribles.id]: v.supporter,
        // "scg/isa": "home/SceneObject",
        "scg/isa": "li/Referent",
        "rdf/type": v.supporterType,
      },
    },
    {
      [tribles.id]: v.locatum,
      "scg/isa": "soma/LocatumRole",
      "dul/classifies": {
        [tribles.id]: v.supportee,
        // "scg/isa": "home/SceneObject",
        "scg/isa": "li/Referent",
        "rdf/type": v.supporteeType,
      },
    },
  ],
}
)}

function _21(md){return(
md`## Constructions`
)}

function _22(md){return(
md`### Grounding inside InitialScene`
)}

function _groundInitialSchemasCxn(tribles){return(
{
  cxnId: "groundInitialSchemas",
  matching: (v) => [
    {
      [tribles.id]: v.initialSceneFromLing,
      "scg/isa": "soma/Scene",
      "cg/sceneState": "cg/initial",
      "dul/satisfies": [
        {
          [tribles.id]: v.schemaFromLing,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": v.schemaName,
        "scg/providedBy": "scg/Parser",
          "dul/defines": [
            {[tribles.id]: v.relatumRoleFromLing,
             "scg/isa": "soma/RelatumRole",
             "dul/classifies": {[tribles.id]: v.relatumFromLing, "scg/isa": "li/Referent", "rdf/type": v.relatumType}
            },
            {[tribles.id]: v.locatumRoleFromLing,
             "scg/isa": "soma/LocatumRole",
             "dul/classifies": {[tribles.id]: v.locatumFromLing, "scg/isa": "li/Referent", "rdf/type": v.locatumType}
            }],
        }]},
    {
    [tribles.id]: v.initialSceneFromSim,
      "scg/isa": "soma/Scene",
  "cg/sceneState": "cg/initial",
      "dul/satisfies": [
        {
          [tribles.id]: v.schemaFromSim,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": v.schemaName,
  "scg/providedBy": "scg/Simulation", 
          "dul/defines": [
            {[tribles.id]: v.relatumRoleFromSim,
             "scg/isa": "soma/RelatumRole",
             "dul/classifies": {[tribles.id]: v.relatumFromSim, "scg/isa": "li/Referent", "rdf/type": v.relatumType}
            },
            {[tribles.id]: v.locatumRoleFromSim,
             "scg/isa": "soma/LocatumRole",
             "dul/classifies": {[tribles.id]: v.locatumFromSim, "scg/isa": "li/Referent", "rdf/type": v.locatumType}
            }],
        },
      ],
    }
  ],
  merging: (v) => [
    {
      [tribles.id]: v.schemaFromLing,
      "scg/groundedTo": v.schemaFromSim
    },
  ],
}
)}

function _24(md){return(
md`### Determiner`
)}

function _determinerCxn(tribles,cookingNS){return(
{
  cxnId: "determiner",
  matching: ({ determinerInterpretation, lexId }) => [
    {
      [tribles.id]: determinerInterpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/DET"
    }
  ],
  calling: function(binding, kb, { lexId, def, num, numerus }) {
    const [lexInfo] = kb.find(cookingNS, ({ definiteness, numerus }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "cg/definiteness": definiteness,
        "li/numerus": numerus
      }
    ]);
    return [
      binding.unifyAll([
        [def, lexInfo.definiteness],
        [num, lexInfo.numerus === "unspecified" ? numerus : lexInfo.numerus]
      ])
    ];
  },
  merging: ({ determinerInterpretation, def, ref, num }) => [
    {
      [tribles.id]: determinerInterpretation,
      "scg/isa": "soma/Word",
      "cg/definiteness": def,
      "li/numerus": num,
      "cg/det-referent": {
        [tribles.id]: ref,
        "cg/identifiability": def,
        "scg/isa": "li/Referent"
      }
    }
  ]
}
)}

function _26(md){return(
md`### Noun`
)}

function _nounCxn(tribles,cookingNS){return(
{
  cxnId: "noun",
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/N"
    }
  ],
  calling: function(binding, kb, { lexId, cat, num, ref }) {
    const [lexInfo] = kb.find(cookingNS, ({ numerus, type }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "li/numerus": numerus,
        "rdf/type": type
      }
    ]);
    return [binding.unifyAll([[cat, lexInfo.type], [num, lexInfo.numerus]])];
  },
  merging: ({ interpretation, num, ref, def, cat }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "li/numerus": num,
      "cg/referent": {
        [tribles.id]: ref,
        "cg/identifiability": def,
        "scg/isa": "li/Referent",
        "cg/hasNumberValue": num,
        "rdf/type": cat
      }
    }
  ]
}
)}

function _28(md){return(
md`### Preposition`
)}

function _prepCxn(tribles,cookingNS){return(
{
  cxnId: "preposition",
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/PREP"
    }
  ],
  calling: function(binding, kb, { lexId, wordForm }) {
    const [lexInfo] = kb.find(cookingNS, ({ form }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "scg/form": form
      }
    ]);
    return [binding.unifyAll([[wordForm, lexInfo.form]])];
  },
  merging: ({ interpretation, wordForm }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "scg/form": wordForm
    }
  ]
}
)}

function _30(md){return(
md`### Conjunction`
)}

function _conjCxn(tribles,cookingNS){return(
{
  cxnId: "conjunction",
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/CONJ"
    }
  ],
  calling: function(binding, kb, { lexId, wordForm }) {
    const [lexInfo] = kb.find(cookingNS, ({ form }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "scg/form": form
      }
    ]);
    return [binding.unifyAll([[wordForm, lexInfo.form]])];
  },
  merging: ({ interpretation, wordForm }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "scg/form": wordForm
    }
  ]
}
)}

function _32(md){return(
md`### Mass Noun NP`
)}

function _massNounNPCxn(tribles,cookingNS){return(
{
  cxnId: "massNounNP",
  matching: (v) => [
    {
      [tribles.id]: v.interpretation,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/N",
      "cg/lexicon": v.lexId,
      "li/numerus": v.num,
      "cg/referent": {
            [tribles.id]: v.ref,
            "scg/isa": "li/Referent",
            "rdf/type": v.ingredientSubtype
          },
      startIndex: v.wordStart,
      endIndex: v.wordEnd,
    },
  ],
  calling: function(binding, kb, v) {
    const [massInfo] = kb.find(cookingNS, ({}) => [
      {
        "rdfs/class": binding.walk(v.ingredientSubtype),
        "rdfs/subClassOf": "soma/Ingredient"
      }
    ]);
    if (massInfo) return [binding];
    else return [];
  },
  merging: (v) => [
    {
      [tribles.id]: v.np,
      "li/numerus": v.num,
      "cg/referent": v.ref,
      "scg/isa": "soma/NP",
      "cg/definiteness": v.def,
      "cg/subunit": [v.interpretation],
      startIndex: v.wordStart,
      endIndex: v.wordEnd,
    },
  ],
}
)}

function _34(md){return(
md`### Determined Noun NP`
)}

function _determinedNounNPCxn(tribles){return(
{
  cxnId: "determinedNounNP",
  matching: (v) => [
    {
      [tribles.id]: v.detIntp,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/DET",
      "li/numerus": v.num,
      "cg/definiteness": v.def,
      "cg/det-referent": v.ref,
      startIndex: v.detStart,
      endIndex: v.meets
    },
    {
      [tribles.id]: v.n,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/N",
      "li/numerus": v.num,
      "cg/referent": v.ref,
      startIndex: v.meets,
      endIndex: v.nEnd
    }
  ],
  merging: (v) => [
    {
      [tribles.id]: v.np,
      "scg/isa": "soma/NP",
      "cg/referent": v.ref,
      "cg/definiteness": v.def,
      "li/numerus": v.num,
      "cg/subunit": [v.detIntp, v.n],
      startIndex: v.detStart, // DET-saturated
      endIndex: v.nEnd
    }
  ]
}
)}

function _36(md){return(
md`### Verb`
)}

function _verbCxn(tribles,cookingNS){return(
{
  cxnId: "verb",
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/V"
    }
  ],
  calling: function(binding, kb, { lexId, tense, agr, schemaName, schemaId }) {
    const [lexInfo] = kb.find(
      cookingNS,
      ({ tense, agr, schemaId, schemaName }) => [
        {
          [tribles.id]: binding.walk(lexId),
          "cg/tense": tense,
          "cg/agreement": agr,
          "scg/evokes": [{ [tribles.id]: schemaId, "rdf/type": schemaName }]
        }
      ]
    );
    return [
      binding.unifyAll([
        [tense, lexInfo.tense],
        [agr, lexInfo.agr], //=== "freeAgreement" ? agree : lexInfo.agr],
        [schemaName, lexInfo.schemaName],
        [schemaId, lexInfo.schemaId]
      ])
    ];
  },
  merging: v => [
    {
      [tribles.id]: v.interpretation,
      "scg/isa": "soma/Word",
      "cg/agreement": v.agr,
      "cg/tense": v.tense,
      "scg/evokes": [
        {
          [tribles.id]: v.schema,
          "scg/isa": "soma/SchemaTheory",
          "scg/schema": v.schemaId,
          "scg/schemaName": v.schemaName
        }
      ]
    }
  ]
}
)}

function _38(md){return(
md`### Adverb`
)}

function _adverbCxn(tribles,cookingNS){return(
{
  cxnId: "adverb",
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADV"
    }
  ],
  calling: function(binding, kb, { lexId, quality }) {
    const [lexInfo] = kb.find(cookingNS, ({ type }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "rdf/type": type
      }
    ]);
    return [binding.unifyAll([[quality, lexInfo.type]])];
  },
  // Assumption: pull out further, detailed semantics in later cxns.
  merging: ({ interpretation, quality }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "rdf/type": quality
    }
  ]
}
)}

function _40(md){return(
md`### Pronoun`
)}

function _pronounCxn(tribles,cookingNS){return(
{
  cxnId: "pronoun",
  matching: ({ interpretation, lexId, wordStart, wordEnd }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/PPRON",
      startIndex: wordStart,
      endIndex: wordEnd,
    }
  ],
  calling: function (binding, kb, { lexId, np, num, numerus }) {
    const [lexInfo] = kb.find(cookingNS, ({ numerus }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "li/numerus": numerus
      }
    ]);
    return [
      binding.unifyAll([
        [num, lexInfo.numerus === "unspecified" ? numerus : lexInfo.numerus]
      ])
    ];
  },
  merging: ({ interpretation, precRef, num, np, wordStart, wordEnd }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "cg/referent": {
        [tribles.id]: precRef,
        "scg/isa": "li/Referent",
        "cg/hasNumberValue": num
      },
      "li/numerus": num
    },
    {
      [tribles.id]: np,
      "scg/isa": "soma/NP",
      "cg/referent": precRef,
      "li/numerus": num,
      "cg/definiteness": "cg/definite",
      "cg/subunit": [interpretation],
      startIndex: wordStart,
      endIndex: wordEnd
    }
  ]
}
)}

function _42(md){return(
md`### Coreference Resolution for Patient Pronouns`
)}

function _corefCxn(tribles,cookingNS){return(
{
  cxnId: "coref",
  matching: (v) => [
    {
      [tribles.id]: v.NP,
      "cg/referent": v.ref,
      startIndex: v.npStart,
      "cg/subunit": [
        {
          [tribles.id]: v.pron,
          "scg/isa": "soma/Word",
          "scg/pos": "soma/PPRON",
        },
      ],
    },
    //TODO add vp-evocation here
    {
      [tribles.id]: v.verbSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": v.schemaName,
      "scg/schema": v.schemaId,
      "dul/defines": [
        {
          [tribles.id]: v.patient,
          "scg/isa": "soma/Patient",
          "dul/classifies": v.ref,
        },
      ],
    },
    {
      [tribles.id]: v.referentNoun,
      "cg/lexicon": v.referentNounLexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/N",
      "cg/referent": v.ref,
      endIndex: v.referentNounEnd
    } //TODO query for most recent referentNounEnd
  ],
  calling: function (binding, kb, v ) {
    const [lexInfo] = kb.find(cookingNS, ({ patientId, patientType, referentNounType }) => [
      {
        [tribles.id]: binding.walk(v.schemaId),
        "soma/Patient": patientId
      },
      {
          [tribles.id]: patientId,
          "rdf/type": patientType,
        },
              {
          [tribles.id]: binding.walk(v.referentNounLexId),
          "rdf/type": referentNounType,
        },
      // {
        //   [tribles.id]: sth,
        //   "rdfs/class": referentNounType,
        //   "rdfs/subClassOf": patientType,
      // },
    ]);
    if (lexInfo) return [binding];
    else return [];
  },
  merging: v => [],
}
)}

function _44(md){return(
md`### Adjective`
)}

function _adjectiveCxn(tribles,cookingNS){return(
{
  cxnId: "adjective", // Adjectives denoting some quality.
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADJ"
    }
  ],
  calling: function(binding, kb, { lexId, cat }) {
    const [lexInfo] = kb.find(cookingNS, ({ form }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "rdf/type": "dul/Quality",
        "scg/form": form
      }
    ]);
    if (lexInfo)
      return [
        binding.unifyAll([
          [cat, lexInfo.form] // TODO: capitalise string
        ])
      ];
    else return [];
  },
  merging: ({ interpretation, quality, cat }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "cg/referent": {
        [tribles.id]: quality,
        "scg/isa": "dul/Quality",
        "rdf/type": cat
      }
    }
  ]
}
)}

function _46(md){return(
md`### Adjective Needing`
)}

function _adjectiveNeedingCxn(tribles,cookingNS){return(
{
  cxnId: "adjectiveNeeding", // Adjectives denoting needing.
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADJ"
    }
  ],
  calling: function(binding, kb, { lexId, needing }) {
    const [lexInfo] = kb.find(cookingNS, ({ form }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "rdf/type": "soma/Needing",
        "scg/form": form
      }
    ]);
    if (lexInfo) return [binding];
    else return [];
  },
  merging: v => [
    {
      [tribles.id]: v.interpretation,
      "scg/isa": "soma/Word",
      "scg/evokes": [
        {
          [tribles.id]: v.needing,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/Needing",
          "dul/defines": [
            {
              [tribles.id]: v.cogniser,
              "scg/isa": "soma/Cognizer",
              "dul/classifies": v.cog
            },
            {
              [tribles.id]: v.requirement,
              "scg/isa": "soma/Requirement",
              "dul/classifies": v.required
            }
          ]
        }
      ]
    }
  ]
}
)}

function _48(md){return(
md`### Adjective Desiring`
)}

function _adjectiveDesiringCxn(tribles,cookingNS){return(
{
  cxnId: "adjectiveDesiring", // Adjectives denoting desiring.
  matching: ({ interpretation, lexId }) => [
    {
      [tribles.id]: interpretation,
      "cg/lexicon": lexId,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADJ"
    }
  ],
  calling: function(binding, kb, { lexId, desiring }) {
    const [lexInfo] = kb.find(cookingNS, ({ form }) => [
      {
        [tribles.id]: binding.walk(lexId),
        "rdf/type": "soma/Desiring",
        "scg/form": form
      }
    ]);
    if (lexInfo) return [binding];
    else return [];
  },
  merging: ({
    interpretation,
    desiring,
    experiencerRole,
    exp,
    eventRole,
    event
  }) => [
    {
      [tribles.id]: interpretation,
      "scg/isa": "soma/Word",
      "scg/evokes": [
        {
          [tribles.id]: desiring,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/Desiring",
          "dul/defines": [
            {
              [tribles.id]: experiencerRole,
              "scg/isa": "soma/Experiencer",
              "dul/classifies": exp
            },
            {
              [tribles.id]: eventRole,
              "scg/isa": "soma/Event",
              "dul/classifies": event
            }
          ]
        }
      ]
    }
  ]
}
)}

function _50(md){return(
md`### VP`
)}

function _vpCxn(tribles){return(
{
  cxnId: "VP",
  matching: ({ v, agr, tense, wordStart, wordEnd }) => [
    {
      [tribles.id]: v,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/V",
      "cg/agreement": agr,
      "cg/tense": tense,
      startIndex: wordStart,
      endIndex: wordEnd,
    }
  ],
  merging: ({ vp, agr, tense, v, wordStart, wordEnd, vpStart, vpEnd }) => [
    {
      [tribles.id]: vp,
      "cg/agreement": agr,
      "cg/tense": tense,
      "scg/isa": "soma/VP",
      "cg/head": v,
      "cg/subunit": [v],
      startIndex: vpStart.leq(wordStart).leq(vpEnd),
      endIndex: vpEnd.geq(wordEnd),
    }
  ]
}
)}

function _52(md){return(
md`### Unexpressed Transitive`
)}

function _unexpressedTransitiveCxn(tribles,cookingNS){return(
{
  cxnId: "unexpressedTransitive", // Extracts core patient roles of verbal schemas.
  matching: ({ vp, v, semVal, verbSchema, schemaId }) => [
    {
      [tribles.id]: vp,
      "scg/isa": "soma/VP",
      "cg/semValence": { [tribles.id]: semVal, "scg/isa": "cg/SemValence" },
      "cg/head": {
        [tribles.id]: v,
        "scg/isa": "soma/Word",
        "scg/pos": "soma/V",
        "scg/evokes": [
          {
            [tribles.id]: verbSchema,
            "scg/isa": "soma/SchemaTheory",
            "scg/schema": schemaId
          }
        ]
      }
    }
  ],
  calling: function (binding, kb, { schemaId, patientRole }) {
    const [lexInfo] = kb.find(cookingNS, ({ patient }) => [
      {
        [tribles.id]: binding.walk(schemaId),
        "soma/Patient": patient
      }
    ]);
    if (lexInfo) return [binding];
    else return [];
  },
  merging: ({ semVal, patientRef, verbSchema, patientRole }) => [
    {
      [tribles.id]: semVal,
      "scg/isa": "cg/SemValence",
      "cg/patient": patientRef
    },
    {
      [tribles.id]: verbSchema,
      "scg/isa": "soma/SchemaTheory",
      "dul/defines": [
        {
          [tribles.id]: patientRole,
          "dul/classifies": 
          { [tribles.id]: patientRef, "scg/isa": "li/Referent" },
          "scg/isa": "soma/Patient"
        }
      ]
    }
  ]
}
)}

function _54(md){return(
md`### Transitive`
)}

function _transitiveCxn(tribles){return(
{
  cxnId: "transitive", // Bind an expressed object to existing clause.
  matching: (v) => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      startIndex: v.clStart,
      endIndex: v.clEnd,
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "scg/isa": "soma/VP",
          "cg/semValence": {
            [tribles.id]: v.semVal,
            "scg/isa": "cg/SemValence",
          },
          "cg/synValence": {
            [tribles.id]: v.synVal,
            "scg/isa": "cg/SynValence",
          },
          "cg/head": {
            [tribles.id]: v.v,
            "scg/word": v.vWordEntity,
            "scg/evokes": [
              {
                [tribles.id]: v.verbSchema,
                "scg/isa": "soma/SchemaTheory",
                "dul/defines": [
                  {
                    [tribles.id]: v.patientRole,
                    "dul/classifies": v.patientRef,
                    "scg/isa": "soma/Patient",
                  },
                ],
              },
            ],
            "scg/isa": "soma/Word",
            "scg/pos": "soma/V",
            endIndex: v.meets,
          },
        },
      ],
    },
    {
      [tribles.id]: v.obj,
      "scg/isa": "soma/NP",
      "cg/referent": v.patientRef,
      startIndex: v.meets,
      endIndex: v.objEnd,
    },
  ],
  merging: (v) => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      endIndex: v.clEnd.geq(v.objEnd),
      // "cg/subunit": [v.obj]
    },
    {
      [tribles.id]: v.vp,
      "scg/isa": "soma/VP",
      "cg/subunit": [v.obj],
      endIndex: v.vpEnd.geq(v.objEnd),
    },
    { [tribles.id]: v.synVal, "scg/isa": "cg/SynValence", "cg/object": v.obj },
    { [tribles.id]: v.semVal, "scg/isa": "cg/SemValence", "cg/patient": v.patientRef },
  ],
}
)}

function _56(md){return(
md`### Discourse Addressee Implicit Subject`
)}

function _discourseAddresseeImplicitSubjectCxn(tribles,cookingNS){return(
{
  cxnId: "discourseAddresseeImplicitSubject", // Adds a null subj to every clause, essentially turning it imperative.
  matching: ({ vp, v, verbSchema, verbSchemaId, vpStart, vpEnd }) => [
    {
      [tribles.id]: vp,
      "scg/isa": "soma/VP",
      startIndex: vpStart,
      endIndex: vpEnd,
      "cg/subunit": [
        {
          [tribles.id]: v,
          "scg/isa": "soma/Word",
          "scg/pos": "soma/V",
          "cg/tense": "cg/present",
          "scg/evokes": [
            {
              [tribles.id]: verbSchema,
              "scg/isa": "soma/SchemaTheory",
              "scg/schema": verbSchemaId,
            },
          ],
        },
      ],
    },
  ],
  calling: function (
    binding,
    kb,
    { verbSchemaId, ref, subj, clause, agentRole, synVal, semVal }
  ) {
    const [lexInfo] = kb.find(cookingNS, ({ agent }) => [
      {
        [tribles.id]: binding.walk(verbSchemaId),
        "soma/AgentRole": agent,
      },
    ]);
    if (lexInfo) return [binding];
    else return [];
  },
  merging: (v) => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "rdf/type": v.clauseType,
      startIndex: v.clStart.leq(v.vpStart),
      endIndex: v.clEnd.geq(v.vpEnd),
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "cg/subunit": [
        {
          [tribles.id]: v.subj,
          "cg/referent": v.ref,
          "scg/isa": "cg/Subject",
          "cg/form": "cg/null",
        },],
          "cg/synValence": {
            [tribles.id]: v.synVal,
            "scg/isa": "cg/SynValence",
            "cg/subject": v.subj,
          },
          "cg/semValence": {
            [tribles.id]: v.semVal,
            "scg/isa": "cg/SemValence",
            "cg/agent": {
              [tribles.id]: v.ref,
              "scg/isa": "li/DiscourseParticipant",
              "rdf/type": "li/DiscourseAddressee",
            },
          },
        },
      ],
    },
    {
      [tribles.id]: v.verbSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schema": v.verbSchemaId,
      "dul/defines": [
        {
          [tribles.id]: v.agentRole,
          "scg/isa": "soma/Agent",
          "dul/classifies": v.ref,
        },
      ],
    },
  ],
}
)}

function _58(md){return(
md`### Imperative`
)}

function _imperativeCxn(tribles){return(
{
  cxnId: "imperative", // Clauses with unexpressed subjects are directly interpreted as imperatives.
  matching: ({ subj, clause, vp, v, verbSchema }) => [
    { [tribles.id]: subj, "cg/form": "cg/null" },
    {
      [tribles.id]: clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [
        {
          [tribles.id]: vp,
          "scg/isa": "soma/VP",
          "cg/subunit": [
            {
              [tribles.id]: v,
              "scg/isa": "soma/Word",
              "cg/tense": "cg/present",
              "scg/evokes": [
                { [tribles.id]: verbSchema, "scg/isa": "soma/SchemaTheory" }
              ]
            },
            subj
          ]
        }
      ]
    }
  ],
  merging: ({
    trans,
    verbSchema,
    initialState,
    terminalState,
    clause,
    illoc
  }) => [
    {
      [tribles.id]: trans,
      "dul/satisfies": [verbSchema],
      "scg/isa": "soma/StateTransition",
      "soma/hasInitialScene": {
        [tribles.id]: initialState,
        "scg/isa": "soma/Scene",
        "cg/sceneState": "cg/initial",
      },
      "soma/hasTerminalScene": {
        [tribles.id]: terminalState,
        "scg/isa": "soma/Scene",
        "cg/sceneState": "cg/terminal",
      },
      "soma/isExpressedBy": {
        [tribles.id]: clause,
        "rdf/type": "soma/ImperativeClause",
        "soma/expresses": {
          [tribles.id]: illoc,
          "scg/isa": "soma/Command",
          "scg/classifies": trans
        }
      }
    }
  ]
}
)}

function _60(md){return(
md`### Prepositional Phrase`
)}

function _ppCxn(tribles){return(
{
  cxnId: "PP",
  matching: (v) => [
    {
      [tribles.id]: v.p,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/PREP",
      endIndex: v.meets,
      startIndex: v.pStart,
      "scg/form": v.prepId
    },
    {
      [tribles.id]: v.np,
      "scg/isa": "soma/NP",
      endIndex: v.npEnd,
      "cg/subunit": [{[tribles.id]: v.npSubunit,
                      "scg/isa": "soma/Word",
                       startIndex: v.meets
                     }]
    }
  ],
  merging: (v) => [
    {
      [tribles.id]: v.pp,
      "cg/prepId": v.prepId,
      "cg/subunit": [
        { [tribles.id]: v.np, "scg/isa": "soma/NP" },
        { [tribles.id]: v.p, "scg/isa": "soma/Word" }
      ],
      "scg/isa": "soma/PP",
      startIndex: v.pStart,
      endIndex: v.npEnd,
    }
  ]
}
)}

function _62(md){return(
md`### NP Locative On PP`
)}

function _npLocativeOnPPCxn(tribles){return(
{
  cxnId: "NPLocativeOnPP", // "Cover the pot on the stove."
  matching: (v) => [
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      startIndex: v.meets,
      endIndex: v.ppEnd,
      "cg/prepId": "on",
      "cg/subunit": [
        {
          [tribles.id]: v.embedNP,
          "scg/isa": "soma/NP",
          "cg/referent": v.supporter
        }
      ]
    },
    {
      [tribles.id]: v.np,
      "scg/isa": "soma/NP",
      "li/numerus": v.num,
      "cg/definiteness": v.def,
      "cg/referent": v.supportee,
      endIndex: v.meets,
      startIndex: v.npStart
    }
  ],
  //TODO somehow integrate support-schema into initial scene (maybe not here but extra cxn)
  merging: (v) => [
    {
      [tribles.id]: v.newNp,
      "scg/isa": "soma/NP",
      "li/numerus": v.num,
      "cg/definiteness": v.def,
      "cg/referent": v.supportee,
      "cg/subunit": [{ [tribles.id]: v.pp, "scg/PPAttachedTo": v.np }, v.np ], // NEW
      startIndex: v.npStart,
      endIndex: v.ppEnd,
      "scg/evokes": [v.supportSchema]
    },
    {
      [tribles.id]: v.supportSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/SupportTheory",
      "dul/defines": [
        {
          [tribles.id]: v.supporterRole,
          "scg/isa": "soma/RelatumRole",
          "dul/classifies": {
            [tribles.id]: v.supporter,
            "scg/isa": "li/Referent"
          }
        },
        {
          [tribles.id]: v.supporteeRole,
          "scg/isa": "soma/LocatumRole",
          "dul/classifies": {
            [tribles.id]: v.supportee,
            "scg/isa": "li/Referent"
          }
        }
      ]
    }
  ]
}
)}

function _64(md){return(
md`### Initial Schemas Describing Objects`
)}

function _initialSchemasCxn(tribles){return(
{
  cxnId: "initialSchemas",
  matching: (v) => [
    {
      [tribles.id]: v.np,
      "scg/isa": "soma/NP",
      "cg/referent": v.ref,
      "scg/evokes": [v.npSchema]
    },
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject"
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": v.clause,
      "soma/hasInitialScene": {
        [tribles.id]: v.initScene,
        "scg/isa": "soma/Scene"
      }
    }
  ],
  //TODO somehow integrate support-schema into initial scene (maybe not here but extra cxn)
  merging: (v) => [
    {
      [tribles.id]: v.initScene,
      "scg/isa": "soma/Scene",
      "dul/satisfies": [{[tribles.id]: v.npSchema,
          "scg/providedBy": "scg/Parser"}]
    }
  ]
}
)}

function _66(md){return(
md`### Locative Off PP`
)}

function _locativeOffPPCxn(tribles){return(
{
  cxnId: "locativeOffPP",
  matching: ({ pp, p, pWord, np, source, pWordEntity }) => [
    {
      [tribles.id]: pp,
      "scg/isa": "soma/PP",
      "cg/prepId": "off",
      "cg/subunit": [
        { [tribles.id]: np, "scg/isa": "soma/NP", "cg/referent": source },
      ]
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.pp,
      "scg/evokes": [
        {
          [tribles.id]: v.spg,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/SourcePathGoalTheory",
          "dul/defines": [
            {
              [tribles.id]: v.goalRole,
              "scg/isa": "soma/Destination",
              "dul/classifies": v.goal
            },
            {
              [tribles.id]: v.trajRole,
              "scg/isa": "soma/Trajector",
              "dul/classifies": v.trajector
            },
            {
              [tribles.id]: v.sourceRole,
              "scg/isa": "soma/Origin",
              "dul/classifies": v.supportSchema
            },
            {
              [tribles.id]: v.pathRole,
              "scg/isa": "soma/PathRole",
              "dul/classifies": {
                [tribles.id]: v.directDist,
                "scg/isa": "soma/SchemaTheory",
                "scg/schemaName": "soma/GeneralDirectionalDistancing",
                "dul/defines": [
                  {
                    [tribles.id]: v.relatumRole,
                    "scg/isa": "soma/RelatumRole",
                    "dul/classifies": v.source
                  },
                  {
                    [tribles.id]: v.locatumRole,
                    "scg/isa": "soma/LocatumRole",
                    "dul/classifies": v.trajector
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      [tribles.id]: v.supportSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/SupportTheory",
      "dul/defines": [
        {
          [tribles.id]: v.supporterRole,
          "scg/isa": "soma/RelatumRole",
          "dul/classifies": v.source
        },
        {
          [tribles.id]: v.supporteeRole,
          "scg/isa": "soma/LocatumRole",
          "dul/classifies": v.trajector
        }
      ]
    }
  ]
}
)}

function _68(md){return(
md`### Locative To PP`
)}

function _locativeToPPCxn(tribles){return(
{
  cxnId: "locativeToPP",
  // Idea: just "to the table", rest of caused-motion and traj-binding will happen elsewhere
  // Evokes an SPG with path classifying GeneralDirectNear and goal Proximal.
  matching: ({ pp, p, pWord, pWordEntity, np, goal }) => [
    {
      [tribles.id]: pp,
      "scg/isa": "soma/PP",
      "cg/prepId": "to",
      "cg/subunit": [
        { [tribles.id]: np, "scg/isa": "soma/NP", "cg/referent": goal },
      ]
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      "scg/evokes": [
        {
          [tribles.id]: v.spg,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/SourcePathGoalTheory",
          "dul/defines": [
            {
              [tribles.id]: v.goalRole,
              "scg/isa": "soma/Destination",
              "dul/classifies": v.proximalSchema
            },
            {
              [tribles.id]: v.trajectorRole,
              "scg/isa": "soma/Trajector",
              "dul/classifies": v.trajector
            },
            {
              [tribles.id]: v.sourceRole,
              "scg/isa": "soma/Origin",
              "dul/classifies": v.sourceSchema
            },
            {
              [tribles.id]: v.pathRole,
              "scg/isa": "soma/PathRole",
              "dul/classifies": {
                [tribles.id]: v.directNear,
                "scg/isa": "soma/SchemaTheory",
                "scg/pos": "soma/GeneralDirectionalNearing",
                "dul/defines": [
                  {
                    [tribles.id]: v.relatumRole,
                    "scg/isa": "soma/RelatumRole",
                    "dul/classifies": v.goal
                  },
                  {
                    [tribles.id]: v.locatumRole,
                    "scg/isa": "soma/LocatumRole",
                    "dul/classifies": v.trajector
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      [tribles.id]: v.proximalSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/ProximalTheory",
      "dul/defines": [
        {
          [tribles.id]: v.relRole,
          "scg/isa": "soma/RelatumRole",
          "dul/classifies": v.goal
        },
        {
          [tribles.id]: v.locRole,
          "scg/isa": "soma/LocatumRole",
          "dul/classifies": v.trajector
        }
      ]
    }
  ]
}
)}

function _70(md){return(
md`### Into PP Adjunct Path`
)}

function _intoPPAdjunctPathCxn(tribles,cookingNS){return(
{
  cxnId: "intoPPAdjunctPath",
  // Idea: just "into the pot", rest of caused-motion and containee-binding will happen elsewhere
  // Evokes an SPG with goal classifying a Containment.
  // Note: The path is not explicitly satisfying a GeneralDirectionalNearing.
  matching: v => [
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      "cg/prepId": "into",
      "cg/subunit": [
        {
          [tribles.id]: v.np,
          "scg/isa": "soma/NP",
          "cg/referent": {
            [tribles.id]: v.container,
            "scg/isa": "li/Referent",
            "rdf/type": v.containerSubtype
          }
        }
      ]
    }
  ],
  calling: function(binding, kb, v) {
    const [containerInfo] = kb.find(cookingNS, ({}) => [
      {
        "rdfs/class": binding.walk(v.containerSubtype),
        "rdfs/subClassOf": "soma/DesignedContainer"
      }
    ]);
    if (containerInfo) return [binding];
    else return [];
  },
  merging: v => [
    {
      [tribles.id]: v.pp,
      "scg/evokes": [
        {
          [tribles.id]: v.spg,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/SourcePathGoalTheory",
          "dul/defines": [
            {
              [tribles.id]: v.goalRole,
              "scg/isa": "soma/Destination",
              "dul/classifies": v.containment
            },
            {
              [tribles.id]: v.trajectorRole,
              "scg/isa": "soma/Trajector",
              "dul/classifies": v.trajector
            },
            {
              [tribles.id]: v.sourceRole,
              "scg/isa": "soma/Origin",
              "dul/classifies": v.source
            },
            {
              [tribles.id]: v.pathRole,
              "scg/isa": "soma/PathRole",
              "dul/classifies": v.path
            }
          ]
        },
        {
          [tribles.id]: v.containment,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/ContainmentTheory",
          "dul/defines": [
            {
              [tribles.id]: v.containerRole,
              "scg/isa": "soma/Container",
              "dul/classifies": v.container
            },
            {
              [tribles.id]: v.containeeRole,
              "scg/isa": "soma/EnclosedObject",
              "dul/classifies": v.trajector
            }
          ]
        }
      ]
    }
  ]
}
)}

function _72(md){return(
md`### Locative On PP`
)}

function _locativeOnPPCxn(tribles){return(
{
  cxnId: "locativeOnPP",
  // Idea: just "on the table", rest of caused-motion and traj-binding will happen elsewhere
  // Evokes an SPG with path classifying GeneralDirectNear and goal Support.
  // TODO Also enables locativeOnProcess (-> change assumption for PP-attachment)
  matching: ({ pp, p, pWord, pWordEntity, np, goal }) => [
    {
      [tribles.id]: pp,
      "scg/isa": "soma/PP",
      "cg/prepId": "on",
      "cg/subunit": [
        { [tribles.id]: np, "scg/isa": "soma/NP", "cg/referent": goal }
      ]
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      "scg/PPAttachedTo": {
        // NEW
        [tribles.id]: v.clause,
        "scg/isa": "soma/ClausalObject"
      },
      "scg/evokes": [
        {
          [tribles.id]: v.spg,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/SourcePathGoalTheory",
          "dul/defines": [
            {
              [tribles.id]: v.goalRole,
              "scg/isa": "soma/Destination",
              "dul/classifies": v.supportSchema
            },
            {
              [tribles.id]: v.trajectorRole,
              "scg/isa": "soma/Trajector",
              "dul/classifies": v.trajector
            },
            {
              [tribles.id]: v.sourceRole,
              "scg/isa": "soma/Origin",
              "dul/classifies": v.sourceSchema
            },
            {
              [tribles.id]: v.pathRole,
              "scg/isa": "soma/PathRole",
              "dul/classifies": {
                [tribles.id]: v.directNear,
                "scg/isa": "soma/SchemaTheory",
                "scg/pos": "soma/GeneralDirectionalNearing",
                "dul/defines": [
                  {
                    [tribles.id]: v.relatumRole,
                    "scg/isa": "soma/RelatumRole",
                    "dul/classifies": v.goal
                  },
                  {
                    [tribles.id]: v.locatumRole,
                    "scg/isa": "soma/LocatumRole",
                    "dul/classifies": v.trajector
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      [tribles.id]: v.supportSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/SupportTheory",
      "dul/defines": [
        {
          [tribles.id]: v.relRole,
          "scg/isa": "soma/RelatumRole",
          "dul/classifies": v.goal
        },
        {
          [tribles.id]: v.locRole,
          "scg/isa": "soma/LocatumRole",
          "dul/classifies": v.trajector
        }
      ]
    }
  ]
}
)}

function _74(md){return(
md`### Caused Motion`
)}

function _causedMotionCxn(tribles){return(
{
  cxnId: "causedMotion", // Aka "path resultative" as in (Goldberg & Jackendoff, 2004).
  matching: v => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "scg/isa": "soma/VP",
          "cg/semValence": {
            [tribles.id]: v.semValence,
            "scg/isa": "cg/SemValence",
            "cg/agent": v.agent,
            "cg/patient": {
              [tribles.id]: v.trajector,
              "scg/isa": "li/Referent"
            }
          },
          "cg/head": {
            [tribles.id]: v.verb,
            "scg/isa": "soma/Word",
            "scg/pos": "soma/V",
            "scg/evokes": [
              { [tribles.id]: v.verbSchema, "scg/isa": "soma/SchemaTheory" }
            ]
          }
        }
      ]
    },
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      endIndex: v.ppEnd,
      "scg/evokes": [
        {
          [tribles.id]: v.spg,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/SourcePathGoalTheory",
          "dul/defines": [
            {
              [tribles.id]: v.pathRole,
              "scg/isa": "soma/PathRole",
              "dul/classifies": v.pathSchema
            },
            {
              [tribles.id]: v.trajRole,
              "scg/isa": "soma/Trajector",
              "dul/classifies": v.trajector
            },
            {
              [tribles.id]: v.sourceRole,
              "scg/isa": "soma/Origin",
              "dul/classifies": v.sourceSchema
            },
            {
              [tribles.id]: v.goalRole,
              "scg/isa": "soma/Destination",
              "dul/classifies": v.goalSchema
            }
          ]
        }
      ]
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": v.clause,
      "soma/hasTerminalScene": {
        [tribles.id]: v.termState,
        "scg/isa": "soma/Scene"
      },
      "soma/hasInitialScene": {
        [tribles.id]: v.initState,
        "scg/isa": "soma/Scene"
      }
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      endIndex: v.clEnd.geq(v.ppEnd),
      "cg/subunit": [{ [tribles.id]: v.pp, "scg/PPAttachedTo": v.clause }] // TODO NEW
    },
    {
      [tribles.id]: v.trans,
      "dul/satisfies": [
        {
          [tribles.id]: v.causeMotion,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/CausedMotionTheory",
          "soma/hasPart": [{ [tribles.id]: v.spg }],
          "dul/defines": [
            {
              [tribles.id]: v.agentRole,
              "scg/isa": "soma/AgentRole",
              "dul/classifies": v.agent
            },
            {
              [tribles.id]: v.causalEventRole,
              "scg/isa": "soma/CausalEventRole",
              "dul/classifies": v.verbSchema
            },
            {
              [tribles.id]: v.pathRole,
              "scg/isa": "soma/PathRole",
              "dul/classifies": v.pathSchema
            },
            {
              [tribles.id]: v.traj2Role,
              "scg/isa": "soma/Trajector",
              "dul/classifies": v.trajector
            }
          ]
        }
      ]
    },
    { [tribles.id]: v.termState, "dul/satisfies": [v.goalSchema] },
    { [tribles.id]: v.initState, "dul/satisfies": [v.sourceSchema] }
  ]
}
)}

function _76(md){return(
md`### If Adj Need Clause`
)}

function _ifAdjNeedClauseCxn(tribles,cookingNS){return(
{
  cxnId: "ifAdjNeedClause",
  // Common ellipsis in recipes, e.g. "Mix the dough, using a fork if needed."
  // The Needing frame's Cognizer role is not bound, since too little info is available.
  matching: v => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "scg/isa": "soma/VP",
          "cg/head": {
            [tribles.id]: v.verb,
            "scg/isa": "soma/Word",
            "scg/pos": "soma/V",
            "scg/evokes": [
              { [tribles.id]: v.verbSchema, "scg/isa": "soma/SchemaTheory" }
            ]
          }
        }
      ]
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": v.clause,
      "soma/hasInitialScene": {
        [tribles.id]: v.initState,
        "scg/isa": "soma/Scene"
      }
    },
    {
      [tribles.id]: v.c,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/CONJ",
      "scg/word": v.cWordEntity,
      endIndex: v.meets
    },
    {
      [tribles.id]: v.adj,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADJ",
      "scg/word": v.adjWordEntity,
      startIndex: v.meets,
      "scg/evokes": [
        {
          [tribles.id]: v.needing,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/Needing",
          "dul/defines": [
            {
              [tribles.id]: v.requirement,
              "scg/isa": "soma/Requirement",
              "dul/classifies": v.verbSchema
            }
          ]
        }
      ]
    }
  ],
  calling: function(binding, kb, { ifAdj, cWordEntity, adjWordEntity }) {
    const [wordFormInfo] = kb.find(cookingNS, ({}) => [
      {
        [tribles.id]: binding.walk(cWordEntity),
        wordForm: "if"
      }
    ]);
    if (wordFormInfo) return [binding];
    else return [];
  },
  merging: ({ clause, c, ifAdj, adj, initState, needing }) => [
    {
      [tribles.id]: clause,
      "cg/subunit": [
        { [tribles.id]: ifAdj, "scg/isa": "soma/IfAdj", "cg/subunit": [adj, c] }
      ]
    },
    { [tribles.id]: initState, "dul/satisfies": [needing] }
  ]
}
)}

function _78(md){return(
md`### If Adj Desire Clause`
)}

function _ifAdjDesireClauseCxn(tribles,cookingNS){return(
{
  cxnId: "ifAdjDesireClause", // Common ellipsis in recipes, e.g. "Add sugar, if desired."
  matching: v => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "scg/isa": "soma/VP",
          "cg/head": {
            [tribles.id]: v.verb,
            "scg/isa": "soma/Word",
            "scg/pos": "soma/V",
            "scg/evokes": [
              //v.verbSchema
              { [tribles.id]: v.verbSchema, "scg/isa": "soma/SchemaTheory" }
            ]
          }
        }
      ]
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": v.clause,
      "soma/hasInitialScene": {
        [tribles.id]: v.initState,
        "scg/isa": "soma/Scene"
      }
    },
    {
      [tribles.id]: v.c,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/CONJ",
      "scg/word": v.cWordEntity,
      endIndex: v.meets
    },
    {
      [tribles.id]: v.adj,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADJ",
      startIndex: v.meets,
      "scg/evokes": [
        {
          [tribles.id]: v.desiring,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/Desiring",
          "dul/defines": [
            {
              [tribles.id]: v.eventRole,
              "scg/isa": "soma/Event",
              "dul/classifies": v.verbSchema
            }
          ]
        }
      ]
    }
  ],
  calling: function(binding, kb, { cWordEntity, adjWordEntity }) {
    const [wordFormInfo] = kb.find(cookingNS, ({}) => [
      {
        [tribles.id]: binding.walk(cWordEntity),
        wordForm: "if"
      }
    ]);
    if (wordFormInfo) return [binding];
    else return [];
  },
  merging: ({ clause, c, ifAdj, adj, initState, desiring }) => [
    {
      [tribles.id]: clause,
      "cg/subunit": [
        { [tribles.id]: ifAdj, "scg/isa": "soma/IfAdj", "cg/subunit": [adj, c] }
      ]
    },
    { [tribles.id]: initState, "dul/satisfies": [desiring] }
  ]
}
)}

function _80(md){return(
md`### Into Property Resultative`
)}

function _intoPropertyResultativeCxn(tribles,cookingNS){return(
{
  cxnId: "intoPropertyResultative", // "Cut the cucumbers into strips."
  matching: v => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "scg/isa": "soma/VP",
          "cg/head": {
            [tribles.id]: v.v,
            "scg/isa": "soma/Word",
            "scg/pos": "soma/V",
            "scg/evokes": [
              {
                [tribles.id]: v.verbSchema,
                "scg/isa": "soma/SchemaTheory",
                "dul/defines": [
                  {
                    [tribles.id]: v.patientRole,
                    "scg/isa": "soma/Patient",
                    "dul/classifies":
                    {
                      [tribles.id]: v.patient,
                      "scg/isa": "li/Referent"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      "cg/subunit": [
        {
          [tribles.id]: v.prep,
          "scg/isa": "soma/Word",
          "scg/pos": "soma/PREP",
          "scg/form": "into",
        },
        {
          [tribles.id]: v.np,
          "scg/isa": "soma/NP",
          "cg/referent": {
            [tribles.id]: v.prop,
            "scg/isa": "li/Referent",
            "rdf/type": v.propSubtype
          }
        }
      ]
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": v.clause,
      "soma/hasTerminalScene": {
        [tribles.id]: v.termState,
        "scg/isa": "soma/Scene"
      }
    }
  ],
  calling: function(binding, kb, v) {
    const [containerInfo] = kb.find(cookingNS, ({}) => [
      {
        "rdfs/class": binding.walk(v.propSubtype),
        "rdfs/subClassOf": "soma/Shape"
      }
    ]);
    if (containerInfo) return [binding];
    else return [];
  },
  merging: v => [
    {
      [tribles.id]: v.propertyResultativeSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/PropertyResultative",
      "dul/defines": [
        {
          [tribles.id]: v.causalEventRole,
          "scg/isa": "soma/CausalEventRole",
          "dul/classifies": v.verbSchema
        },
        {
          [tribles.id]: v.propertyRole,
          "scg/isa": "soma/Property",
          "dul/classifies": v.prop
        },
        {
          [tribles.id]: v.objectRole,
          "scg/isa": "soma/Object",
          "dul/classifies": v.patient
        }
      ]
    },
    {
      [tribles.id]: v.propertyAscription,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/PropertyAscription",
      "dul/defines": [
        {
          [tribles.id]: v.propRole,
          "scg/isa": "soma/Property",
          "dul/classifies": v.prop
        },
        {
          [tribles.id]: v.propertyRole,
          "scg/isa": "soma/Property",
          "dul/classifies": v.prop
        },
        {
          [tribles.id]: v.objRole,
          "scg/isa": "soma/Object",
          "dul/classifies": v.patient
        }
      ]
    },
    { [tribles.id]: v.clause, "cg/subunit": [v.pp] },
    { [tribles.id]: v.trans, "dul/satisfies": [v.propertyResultativeSchema] },
    { [tribles.id]: v.termState, "dul/satisfies": [v.propertyAscription] }
  ]
}
)}

function _82(md){return(
md`### Until Adj Postcondition`
)}

function _untilAdjPostconditionCxn(tribles,cookingNS){return(
{
  cxnId: "untilAdjPostcondition", // Common recipe ellipsis, e.g. "Whisk (the dough) until smooth."
  matching: v => [
    {
      [tribles.id]: v.p,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/PREP",
      "scg/word": v.pWordEntity,
      endIndex: v.meets
    },
    {
      [tribles.id]: v.adj,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADJ",
      "cg/referent": { [tribles.id]: v.quality, "scg/isa": "dul/Quality" },
      startIndex: v.meets
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": {
        [tribles.id]: v.clause,
        "scg/isa": "soma/ClausalObject",
        "cg/subunit": [
          {
            [tribles.id]: v.vp,
            "scg/isa": "soma/VP",
            "cg/head": {
              [tribles.id]: v.v,
              "scg/isa": "soma/Word",
              "scg/pos": "soma/V",
              "scg/evokes": [
                {
                  [tribles.id]: v.verbSchema,
                  "scg/isa": "soma/SchemaTheory",
                  "dul/defines": [
                    {
                      [tribles.id]: v.patientRole,
                      "scg/isa": "soma/Patient",
                      "dul/classifies": v.patient
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      "soma/hasTerminalScene": {
        [tribles.id]: v.termState,
        "scg/isa": "soma/Scene"
      }
    }
  ],
  // Assumption: whenever a core patient is defined in either the sentence itself or the verb frame's roles, that has been brought into the transient structure, already.
  calling: function(binding, kb, v) {
    const [wordFormInfo] = kb.find(cookingNS, ({}) => [
      {
        [tribles.id]: binding.walk(v.pWordEntity),
        wordForm: "until"
      }
    ]);
    if (wordFormInfo) return [binding];
    else return [];
  },
  merging: v => [
    {
      [tribles.id]: v.adjP,
      "scg/isa": "cg/untilAdj",
      "scg/evokes": [
        {
          [tribles.id]: v.qualityAscription,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/QualityAscription",
          "dul/defines": [
            {
              [tribles.id]: v.objRole,
              "scg/isa": "soma/Object",
              "dul/classifies": v.patient
            },
            {
              [tribles.id]: v.qualityRole,
              "scg/isa": "soma/QualityRole",
              "dul/classifies": v.quality
            }
          ]
        }
      ],
      "cg/subunit": [v.p, v.adj]
    },
    { [tribles.id]: v.termState, "dul/satisfies": [v.qualityAscription] }
  ]
}
)}

function _84(md){return(
md`### Contained PP`
)}

function _containedPPCxn(tribles){return(
{
  cxnId: "containedPP", // "Whisk with a spoon", "The man with the hoodie", "Handle with care."
  matching: ({ pp, p, pWord, pWordEntity, np, entity }) => [
    {
      [tribles.id]: pp,
      "scg/isa": "soma/PP",
      "cg/prepId": "with",
      "cg/subunit": [
        {
          [tribles.id]: np,
          "scg/isa": "soma/NP",
          "cg/referent": { [tribles.id]: entity, "scg/isa": "li/Referent" }
        }
      ]
    }
  ],
  merging: ({ pp, linkSchema, linked1, linked2, something, entity }) => [
    {
      [tribles.id]: pp,
      "scg/evokes": [
        {
          [tribles.id]: linkSchema,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/LinkTheory",
          "dul/defines": [
            {
              [tribles.id]: linked1,
              "scg/isa": "soma/Linked-1",
              "dul/classifies": something
            },
            {
              [tribles.id]: linked2,
              "scg/isa": "soma/Linked-2",
              "dul/classifies": entity
            }
          ]
        }
      ]
    }
  ]
}
)}

function _86(md){return(
md`### Instrumental PP Process`
)}

function _instrumentalPPProcessCxn(tribles,cookingNS){return(
{
  cxnId: "instrumentalPPProcess", // "Whisk with a spoon."
  matching: v => [
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [
        {
          [tribles.id]: v.vp,
          "scg/isa": "soma/VP",
          "cg/head": {
            [tribles.id]: v.v,
            "scg/isa": "soma/Word",
            "scg/evokes": [v.verbSchema]
          }
        }
      ]
    },
    {
      [tribles.id]: v.pp,
      "scg/isa": "soma/PP",
      "cg/prepId": "with",
      "cg/subunit": [
        {
          [tribles.id]: v.np,
          "scg/isa": "soma/NP",
          "cg/referent": {
            [tribles.id]: v.instrument,
            "scg/isa": "li/Referent",
            "rdf/type": v.instrumentSubtype
          }
        }
      ]
    },
    {
      [tribles.id]: v.linkSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/LinkTheory",
      "dul/defines": [
        {
          [tribles.id]: v.linked1,
          "scg/isa": "soma/Linked-1",
          "dul/classifies": v.verbSchema
        },
        {
          [tribles.id]: v.linked2,
          "scg/isa": "soma/Linked-2",
          "dul/classifies": v.instrument
        }
      ]
    }
  ],
  calling: function(
    binding,
    kb,
    { instrumentSubtype, pWordEntity, instrumentRole }
  ) {
    const [instrumentInfo] = kb.find(cookingNS, ({}) => [
      {
        "rdfs/class": binding.walk(instrumentSubtype),
        "rdfs/subClassOf": "soma/Instrument"
      },
    ]);
    if (instrumentInfo) return [binding];
    else return [];
  },
  merging: ({ clause, pp, verbSchema, instrumentRole, instrument }) => [
    { [tribles.id]: clause, "cg/subunit": [pp] },
    {
      [tribles.id]: verbSchema,
      "scg/isa": "soma/SchemaTheory",
      "dul/defines": [
        {
          [tribles.id]: instrumentRole,
          "scg/isa": "soma/Instrument",
          "dul/classifies": instrument
        }
      ]
    }
  ]
}
)}

function _88(md){return(
md`### Covering`
)}

function _coveringCxn(tribles){return(
{
  cxnId: "covering",
  matching: v => [
    {
      [tribles.id]: v.vp,
      "scg/isa": "soma/VP",
      "cg/semValence": {
        [tribles.id]: v.semVal,
        "scg/isa": "cg/SemValence",
        "cg/patient": v.covered
      },
      "cg/head": {
        [tribles.id]: v.v,
        "scg/isa": "soma/Word",
        "scg/pos": "soma/V",
        "scg/evokes": [
          {
            [tribles.id]: v.verbSchema,
            "scg/isa": "soma/SchemaTheory",
            "scg/schemaName": "soma/CoveringTheory"
          }
        ]
      }
    },
    {
      [tribles.id]: v.clause,
      "scg/isa": "soma/ClausalObject",
      "cg/subunit": [v.vp]
    },
    {
      [tribles.id]: v.trans,
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": v.clause,
      "soma/hasTerminalScene": {
        [tribles.id]: v.termState,
        "scg/isa": "soma/Scene",
        "cg/sceneState": "cg/terminal"
      }
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.coverageSchema,
      "scg/isa": "soma/SchemaTheory",
      "scg/schemaName": "soma/CoverageTheory",
      "dul/defines": [
        {
          [tribles.id]: v.coveredRole,
          "scg/isa": "soma/RelatumRole",
          "dul/classifies": v.covered
        },
        {
          [tribles.id]: v.covererRole,
          "scg/isa": "soma/LocatumRole",
          "dul/classifies": v.coverer
        }
      ]
    },
    {
      [tribles.id]: v.trans,
      "dul/satisfies": [
        {
          [tribles.id]: v.verbSchema,
          "dul/defines": [
            {
              [tribles.id]: v.instrumentRole,
              "scg/isa": "soma/Instrument",
              "dul/classifies": v.coverer
            }
          ]
        }
      ]
    },
    { [tribles.id]: v.termState, "dul/satisfies": [v.coverageSchema] }
  ]
}
)}

function _90(md){return(
md`### Shape Quality Adverb`
)}

function _shapeQualityAdverbCxn(tribles,cookingNS){return(
{
  cxnId: "shapequalityAdverb",
  matching: v => [
    {
      [tribles.id]: v.adv,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/ADV",
      "rdf/type": "soma/ShapeQuality",
      "cg/lexicon": v.advLex
    },
    {
      [tribles.id]: v.v,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/V",
      "scg/evokes": [
        {
          [tribles.id]: v.verbSchema,
          "scg/isa": "soma/SchemaTheory",
          "dul/defines": [
            {
              [tribles.id]: v.patientRole,
              "scg/isa": "soma/Patient",
              "dul/classifies": v.patient
            }
          ],
          "scg/schema": v.verbSchemaId
        }
      ]
    },
    {
      [tribles.id]: v.trans,
      "dul/satisfies": [v.verbSchema],
      "scg/isa": "soma/StateTransition",
      "soma/hasTerminalScene": v.term
    }
  ],
  calling: function(binding, kb, v) {
    const [shapeInfo] = kb.find(cookingNS, ({ form }) => [
      {
        [tribles.id]: binding.walk(v.verbSchemaId),
        "scg/eventType": "soma/ModifyingPhysicalObject"
      },
      {
        [tribles.id]: binding.walk(v.advLex),
        "scg/form": form
      }
    ]);
    if (shapeInfo)
      return [
        binding.unifyAll([
          [v.qual, shapeInfo.form] //TODO capitalise
        ])
      ];
    else return [];
  },
  merging: v => [
    {
      [tribles.id]: v.trans,
      "dul/satisfies": [
        {
          [tribles.id]: v.propSchema,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/PropertyResultative",
          "dul/defines": [
            {
              [tribles.id]: v.propRole,
              "scg/isa": "soma/Property",
              "dul/classifies": {
                [tribles.id]: v.quality,
                "scg/isa": "soma/ShapeQuality",
                "rdf/type": v.qual
              }
            },
            {
              [tribles.id]: v.objRole,
              "scg/isa": "soma/Object",
              "dul/classifies": v.patient
            },
            {
              [tribles.id]: v.evRole,
              "scg/isa": "soma/CausalEventRole",
              "dul/classifies": v.verbSchema
            }
          ]
        }
      ]
    },
    {
      [tribles.id]: v.term,
      "dul/satisfies": [
        {
          [tribles.id]: v.propAscSchema,
          "scg/isa": "soma/SchemaTheory",
          "scg/schemaName": "soma/PropertyAscription",
          "dul/defines": [
            {
              [tribles.id]: v.propAscRole,
              "scg/isa": "soma/Property",
              "dul/classifies": v.quality
            },
            {
              [tribles.id]: v.objAscRole,
              "scg/isa": "soma/Object",
              "dul/classifies": v.patient
            }
          ]
        }
      ]
    }
  ]
}
)}

function _92(md){return(
md`### Command "and" Linking
This <span style="font-variant:small-caps;">cxn</span> links two clauses expressing commands together, so that their respective state transitions are coordinated.`
)}

function _commandAndLinkCxn(tribles){return(
{
  cxnId: "commandAndLink",
  matching: v => [
    {
      [tribles.id]: v.trans1,
      // "dul/satisfies": [v.verbSchema1],
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": {
        [tribles.id]: v.cl1,
        "rdf/type": "soma/ImperativeClause",
        "scg/isa": "soma/ClausalObject",
        endIndex: v.cl1End,
        "soma/expresses": {
          [tribles.id]: v.illoc1,
          "scg/isa": "soma/Command",
          "scg/classifies": v.trans1
        }
      }
    },
    {
      [tribles.id]: v.conj,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/CONJ",
       startIndex: v.cl1End,
       endIndex: v.cl2Start,
      "scg/form": "and"
    },
    {
      [tribles.id]: v.trans2,
      // "dul/satisfies": [v.verbSchema2],
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": {
        [tribles.id]: v.cl2,
        "rdf/type": "soma/ImperativeClause",
        "scg/isa": "soma/ClausalObject",
        startIndex: v.cl2Start,
        "soma/expresses": {
          [tribles.id]: v.illoc2,
          "scg/isa": "soma/Command",
          "scg/classifies": v.trans2
        }
      }
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.trans1,
      "soma/precedes": [v.trans2]
    }
  ]
}
)}

function _94(md){return(
md`### Command "then" Linking
This <span style="font-variant:small-caps;">cxn</span> links two clauses expressing commands together, so that their respective state transitions are coordinated in time.`
)}

function _commandThenLinkCxn(tribles){return(
{
  cxnId: "commandThenLink",
  matching: v => [
    {
      [tribles.id]: v.trans1,
      // "dul/satisfies": [v.verbSchema1],
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": {
        [tribles.id]: v.cl1,
        "rdf/type": "soma/ImperativeClause",
        "scg/isa": "soma/ClausalObject",
        endIndex: v.cl1End,
        "soma/expresses": {
          [tribles.id]: v.illoc1,
          "scg/isa": "soma/Command",
          "scg/classifies": v.trans1
        }
      }
    },
    {
      [tribles.id]: v.conj,
      "scg/isa": "soma/Word",
      "scg/pos": "soma/CONJ",
       startIndex: v.cl1End,
       endIndex: v.cl2Start,
      "scg/form": "then"
    },
    {
      [tribles.id]: v.trans2,
      // "dul/satisfies": [v.verbSchema2],
      "scg/isa": "soma/StateTransition",
      "soma/isExpressedBy": {
        [tribles.id]: v.cl2,
        "rdf/type": "soma/ImperativeClause",
        "scg/isa": "soma/ClausalObject",
        startIndex: v.cl2Start,
        "soma/expresses": {
          [tribles.id]: v.illoc2,
          "scg/isa": "soma/Command",
          "scg/classifies": v.trans2
        }
      }
    }
  ],
  merging: v => [
    {
      [tribles.id]: v.trans1,
      "soma/precedes": [v.trans2]
    }
  ]
}
)}

function _96(md){return(
md`# Import 📦`
)}

function _tribles(require){return(
require("tribles@0.8.2/dist/tribles.js")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("cookingGrammar")).define("cookingGrammar", ["grammar","cookingNS","wordFormSourceCxn","extractInitialSceneFromSimCxn","groundInitialSchemasCxn","determinerCxn","nounCxn","massNounNPCxn","determinedNounNPCxn","verbCxn","prepCxn","conjCxn","pronounCxn","vpCxn","unexpressedTransitiveCxn","transitiveCxn","discourseAddresseeImplicitSubjectCxn","imperativeCxn","ppCxn","npLocativeOnPPCxn","locativeOffPPCxn","locativeOnPPCxn","locativeToPPCxn","causedMotionCxn","initialSchemasCxn"], _cookingGrammar);
  main.variable(observer("cookingKB")).define("cookingKB", ["withLexicon","tribles","cookingLexicon"], _cookingKB);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("ids")).define("ids", ["tribles"], _ids);
  main.variable(observer("attrNames")).define("attrNames", ["cookingNS"], _attrNames);
  main.variable(observer("cookingNS")).define("cookingNS", ["tribles","lexInvariants","lexNamespace","wordNamespace"], _cookingNS);
  main.variable(observer("wordNS")).define("wordNS", ["tribles","wordNamespace"], _wordNS);
  main.variable(observer("lexNamespace")).define("lexNamespace", ["tribles","ids"], _lexNamespace);
  main.variable(observer("lexInvariants")).define("lexInvariants", ["ids"], _lexInvariants);
  main.variable(observer("withLexicon")).define("withLexicon", ["tribles","cookingNS"], _withLexicon);
  main.variable(observer("cookingLexicon")).define("cookingLexicon", ["ids","tribles"], _cookingLexicon);
  main.variable(observer("lexById")).define("lexById", ["cookingLexicon"], _lexById);
  main.variable(observer("lexByForm")).define("lexByForm", ["cookingLexicon"], _lexByForm);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("wordFormSourceCxn")).define("wordFormSourceCxn", ["tribles"], _wordFormSourceCxn);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("extractInitialSceneFromSimCxn")).define("extractInitialSceneFromSimCxn", ["tribles"], _extractInitialSceneFromSimCxn);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("groundInitialSchemasCxn")).define("groundInitialSchemasCxn", ["tribles"], _groundInitialSchemasCxn);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("determinerCxn")).define("determinerCxn", ["tribles","cookingNS"], _determinerCxn);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("nounCxn")).define("nounCxn", ["tribles","cookingNS"], _nounCxn);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("prepCxn")).define("prepCxn", ["tribles","cookingNS"], _prepCxn);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("conjCxn")).define("conjCxn", ["tribles","cookingNS"], _conjCxn);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("massNounNPCxn")).define("massNounNPCxn", ["tribles","cookingNS"], _massNounNPCxn);
  main.variable(observer()).define(["md"], _34);
  main.variable(observer("determinedNounNPCxn")).define("determinedNounNPCxn", ["tribles"], _determinedNounNPCxn);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer("verbCxn")).define("verbCxn", ["tribles","cookingNS"], _verbCxn);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("adverbCxn")).define("adverbCxn", ["tribles","cookingNS"], _adverbCxn);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("pronounCxn")).define("pronounCxn", ["tribles","cookingNS"], _pronounCxn);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("corefCxn")).define("corefCxn", ["tribles","cookingNS"], _corefCxn);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer("adjectiveCxn")).define("adjectiveCxn", ["tribles","cookingNS"], _adjectiveCxn);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer("adjectiveNeedingCxn")).define("adjectiveNeedingCxn", ["tribles","cookingNS"], _adjectiveNeedingCxn);
  main.variable(observer()).define(["md"], _48);
  main.variable(observer("adjectiveDesiringCxn")).define("adjectiveDesiringCxn", ["tribles","cookingNS"], _adjectiveDesiringCxn);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("vpCxn")).define("vpCxn", ["tribles"], _vpCxn);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("unexpressedTransitiveCxn")).define("unexpressedTransitiveCxn", ["tribles","cookingNS"], _unexpressedTransitiveCxn);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer("transitiveCxn")).define("transitiveCxn", ["tribles"], _transitiveCxn);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer("discourseAddresseeImplicitSubjectCxn")).define("discourseAddresseeImplicitSubjectCxn", ["tribles","cookingNS"], _discourseAddresseeImplicitSubjectCxn);
  main.variable(observer()).define(["md"], _58);
  main.variable(observer("imperativeCxn")).define("imperativeCxn", ["tribles"], _imperativeCxn);
  main.variable(observer()).define(["md"], _60);
  main.variable(observer("ppCxn")).define("ppCxn", ["tribles"], _ppCxn);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer("npLocativeOnPPCxn")).define("npLocativeOnPPCxn", ["tribles"], _npLocativeOnPPCxn);
  main.variable(observer()).define(["md"], _64);
  main.variable(observer("initialSchemasCxn")).define("initialSchemasCxn", ["tribles"], _initialSchemasCxn);
  main.variable(observer()).define(["md"], _66);
  main.variable(observer("locativeOffPPCxn")).define("locativeOffPPCxn", ["tribles"], _locativeOffPPCxn);
  main.variable(observer()).define(["md"], _68);
  main.variable(observer("locativeToPPCxn")).define("locativeToPPCxn", ["tribles"], _locativeToPPCxn);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer("intoPPAdjunctPathCxn")).define("intoPPAdjunctPathCxn", ["tribles","cookingNS"], _intoPPAdjunctPathCxn);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer("locativeOnPPCxn")).define("locativeOnPPCxn", ["tribles"], _locativeOnPPCxn);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("causedMotionCxn")).define("causedMotionCxn", ["tribles"], _causedMotionCxn);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer("ifAdjNeedClauseCxn")).define("ifAdjNeedClauseCxn", ["tribles","cookingNS"], _ifAdjNeedClauseCxn);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer("ifAdjDesireClauseCxn")).define("ifAdjDesireClauseCxn", ["tribles","cookingNS"], _ifAdjDesireClauseCxn);
  main.variable(observer()).define(["md"], _80);
  main.variable(observer("intoPropertyResultativeCxn")).define("intoPropertyResultativeCxn", ["tribles","cookingNS"], _intoPropertyResultativeCxn);
  main.variable(observer()).define(["md"], _82);
  main.variable(observer("untilAdjPostconditionCxn")).define("untilAdjPostconditionCxn", ["tribles","cookingNS"], _untilAdjPostconditionCxn);
  main.variable(observer()).define(["md"], _84);
  main.variable(observer("containedPPCxn")).define("containedPPCxn", ["tribles"], _containedPPCxn);
  main.variable(observer()).define(["md"], _86);
  main.variable(observer("instrumentalPPProcessCxn")).define("instrumentalPPProcessCxn", ["tribles","cookingNS"], _instrumentalPPProcessCxn);
  main.variable(observer()).define(["md"], _88);
  main.variable(observer("coveringCxn")).define("coveringCxn", ["tribles"], _coveringCxn);
  main.variable(observer()).define(["md"], _90);
  main.variable(observer("shapeQualityAdverbCxn")).define("shapeQualityAdverbCxn", ["tribles","cookingNS"], _shapeQualityAdverbCxn);
  main.variable(observer()).define(["md"], _92);
  main.variable(observer("commandAndLinkCxn")).define("commandAndLinkCxn", ["tribles"], _commandAndLinkCxn);
  main.variable(observer()).define(["md"], _94);
  main.variable(observer("commandThenLinkCxn")).define("commandThenLinkCxn", ["tribles"], _commandThenLinkCxn);
  main.variable(observer()).define(["md"], _96);
  const child1 = runtime.module(define1);
  main.import("parser", child1);
  main.import("grammar", child1);
  main.import("introduce", child1);
  main.import("wordNamespace", child1);
  main.variable(observer("tribles")).define("tribles", ["require"], _tribles);
  return main;
}
