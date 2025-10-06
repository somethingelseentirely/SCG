// https://observablehq.com/@port/streaming-construction-grammar@20186
import define1 from "./212f9f2d725343b2@985.js";

function _1(md,ref){return(
md`# Streaming Construction Grammar 🦦 
Streaming Construction Grammar (SCG; ${ref(
  "Cangalovic et al. 2021",
  "Streamlining Formal Construction Grammar. ICCG11",
  ""
)}) is both a Construction Grammar formalism ${ref(
  "Fillmore 1988",
  'The Mechanisms of "Construction Grammar"',
  "https://journals.linguisticsociety.org/proceedings/index.php/BLS/article/viewFile/1794/1566"
)} ${ref(
  "Goldberg 1995",
  "Constructions: A Construction Grammar Approach to Argument Structure",
  "https://press.uchicago.edu/ucp/books/book/chicago/C/bo3683810.html"
)} as well as a parser implementation for simulation-based natural language understanding. It was developed in the CRC [EASE](https://ease-crc.org/), where it transforms underspecified natural language instructions from the kitchen domain into interpretations of an ontological model ${ref(
  "Beßler et al. 2020",
  "Foundations of the Socio-physical Model of Activities (SOMA) for Autonomous Robotic Agents",
  "https://www.researchgate.net/publication/346302872_Foundations_of_the_Socio-physical_Model_of_Activities_SOMA_for_Autonomous_Robotic_Agents"
)}. SCG draws inspiration from Embodied Construction Grammar and Fluid Construction Grammar, combining constructions as mental simulation-parameterising operations tightly integrating external knowledge bases, with the computational model of unification and merging. ${ref(
  "Feldman et al. 2009",
  "A Neural Theory of Language and Embodied Construction Grammar",
  "http://www1.icsi.berkeley.edu/ftp/pub/feldman/OxfordHandbook.pdf"
)} ${ref(
  "Steels et al. 2006",
  "Unify and Merge in Fluid Construction Grammar",
  "https://ai.vub.ac.be/sites/default/files/steels-06b.pdf"
)}

SCG attempts to achieve good runtime properties while gaining the ability to incrementally parse changing sentence and context information and maintain multiple concurrent hypotheses for ambiguous instructions.

Idea: There are no distinct steps and information flow directions specified, as in a pipeline. Instead, all parts of the system are connected via *streams* of information.`
)}

function _2(md){return(
md`## Word Ontology`
)}

function _wordNamespace(tribles)
{
  const ids = tribles.UFOID.namedCache();
  tribles.globalInvariants({
    [ids.wordWordForm]: { isUnique: true },
    [ids.startIndex]: { isUnique: true },
    [ids.endIndex]: { isUnique: true },
    [ids.wordMeets]: {
      isLink: true,
      isUnique: true,
      isUniqueInverse: true,
    },
    [ids.wordPrecededBy]: { isLink: true },
    [ids.wordTag]: {},
    [ids.scgWordEntity]: { isLink: true, isUnique: true }, // TODO Also isUniqueInverse?
  });

  return {
    [tribles.id]: tribles.types.ufoid,
    wordForm: {
      id: ids.wordWordForm,
      ...tribles.types.shortstring,
    },
    startIndex: { id: ids.startIndex, ...tribles.types.biguint256 },
    endIndex: { id: ids.endIndex, ...tribles.types.biguint256 },
    meets: { id: ids.wordMeets },
    metBy: { id: ids.wordMeets, isInverse: true },
    precedes: { id: ids.wordPrecededBy, isInverse: true },
    precededBy: { id: ids.wordPrecededBy },
    tag: {
      id: ids.wordTag,
      ...tribles.types.shortstring,
    },
    "scg/wordEntity": { id: ids.scgWordEntity },
  };
}


function _4(md){return(
md`## Interface`
)}

function _introduce(){return(
variables =>
  function(binding, kb, varProvider) {
    return [binding];
    // [
    //   binding.unifyAll(
    //     variables.map(v => [varProvider[v], tribles.UFOID.now()])
    //   )
    // ];
  }
)}

function _grammar(im,SourceCXN,CXN,mergeBindings,mergeMatchPrecompute,Precomp,tribles,Grammar){return(
(ns, sourceCxns, innerCxns) => {
  const cxns = im
    .Map([
      ...sourceCxns.map((cxn) => [cxn.cxnId, new SourceCXN(cxn)]),
      ...innerCxns.map((cxn) => [cxn.cxnId, new CXN(cxn)]),
    ])
    .map((cxn) => cxn.init(ns));
  let precomps = [];
  for (let [mergeCxnId, mergeCxn] of cxns.entries()) {
    for (let [matchCxnId, matchCxn] of cxns.entries()) {
      //TODO remove later
      if (mergeCxnId != matchCxnId) {
        console.log(
          `MergeCxn: ${mergeCxnId}, MatchCxn: ${matchCxnId} for next precomp-calculation`
        );
        mergeCxn = mergeCxn.fresh();
        matchCxn = matchCxn.fresh();
        const mergeMatchBinding = mergeBindings([
          mergeCxn.binding,
          matchCxn.binding,
        ]);
        if (mergeMatchBinding.valid) {
          const precomputations = matchCxn.independentMatchingTripleSets
            .flatMap((independentMatchingSet) =>
              im.List(mergeMatchPrecompute(
                mergeMatchBinding,
                mergeCxn.merging,
                matchCxn.matching,
                independentMatchingSet
              ))
            )
            .groupBy((precomp) => precomp.touchedMatchTriples)
            .valueSeq()
            .map((precomps) => precomps.first());

          for (const {
            precomputeBinding,
            touchedMatchTriples,
          } of precomputations) {
            precomps.push(
              new Precomp({
                id: tribles.UFOID.now(),
                matchingId: matchCxnId,
                mergingId: mergeCxnId,
                matchingVariables: matchCxn.variables,
                mergingVariables: mergeCxn.variables,
                binding: precomputeBinding,
                touchedMatchTriples,
              })
            );
          }
        }
      }
    }
  }
  precomps = im.Map(precomps.map((precomp) => [precomp.id, precomp]));

  const precompsForMerge = im
    .Map()
    .mergeWith(
      (o, v) => [...o, ...v],
      ...[...precomps.values()].map((precomp) => [
        [precomp.mergingId, [precomp.id]],
      ])
    );

  return new Grammar({
    ns,
    cxns,
    precomps,
    precompsForMerge,
  });
}
)}

function _parser(SearchSpace){return(
(grammar, kbBox) => new SearchSpace(grammar, kbBox)
)}

function _8(md){return(
md`## Grammar & Constructions`
)}

function _9(md,ref){return(
md`In SCG, the classical attribute-value-matrices are normalised into triples, also known as _entity-attribute-value tuples_. This simplified representation is used for input, output, as well as internal data.

Additionally, a novel query operator between the match and merge operations is introduced. Queries allow constructions to access a shared monotonic knowledge base, i.e. a tuplespace that is based on a common data representation,  defined by an ontology and its constraints. Using a common knowledge framework for the grammar, the attached knowledge base, and the robotic systems allows for seamless communication and enables realtime bi-directional data streams between them, see also [SourceCXN](#ExplainSourceCXN) below. Moreover, queries using knowledge from an ontology, a simulation, or robotic sensors might:

- act as a success criterion, e.g. by expressing role filler type constraints, such as those in Embodied Construction Grammar,
- enable context-aware constructions,
- facilitate the processing of syntactically ambiguous instructions, e.g. distinguishing CausedMotion from PropertyResultative, or
- resolve coreferences via both syntactic heuristics as well as semantic constraints ${ref(
  "Raghuram et al. 2017",
  "Semantically-Driven Coreference Resolution with Embodied Construction Grammar",
  "https://www.aaai.org/ocs/index.php/SSS/SSS17/paper/viewFile/15337/14540"
)}.
`
)}

function _10(md){return(
md`#### CXN
A linguistic form-meaning mapping, the basic unit of CxGs. Match & Merge & CallToDatabase

##### Attributes:
 * _cxnId_: UUID
 * _matching_: the information that needs to be present in order for this cxn to apply
 * _calling_: a query 
 * _merging_: the information that an application of this cxn supplies`
)}

function _findUniquelyConnectedComponentsOld(im,tribles){return(
(ns, triples) => {
  const triplesForEntity = im.List([...triples])
                               .filter(t => tribles.getInvariant(t.a).isUnique)
                               .groupBy((t) => t.e);
  const triplesForValue = im.List([...triples])
                               .filter(t => tribles.getInvariant(t.a).isUnique)
                               .groupBy((t) => t.v);
  const indexByTriple = im.Map(im.List([...triples]).map((t, i) => [t, i]));
  
  let components = im.Set();
  for(const t of triples) {
    const work = [t];
    let visited = im.Set();
    let component = im.Set();
    while(work.length > 0) {
      const t = work.pop();
      if(visited.has(t)) continue;
      visited = visited.add(t);
      component = component.add(indexByTriple.get(t));
      if(tribles.getInvariant(t.a).isUnique) {
        work.push(...triplesForEntity.get(t.e))
        work.push(...triplesForEntity.get(t.v))
        work.push(...triplesForValue.get(t.v))
      }
      if(tribles.getInvariant(t.a).isUniqueInverse) {
        work.push(...triplesForEntity.get(t.e))
        work.push(...triplesForEntity.get(t.v))
        work.push(...triplesForValue.get(t.v))
      }
    }
  }
  return components;
}
)}

function _findUniquelyConnectedComponents(im,tribles){return(
(ns, triples) => {
  const uniqueTriples = im.List([...triples])
                               .filter(t => tribles.getInvariant(t.a).isUnique)
                               .groupBy((t) => t.e);
  const uniqueInverseTriples = im.List([...triples])
                               .filter(t => tribles.getInvariant(t.a).isUniqueInverse)
                               .groupBy((t) => t.v);
  const unconstrainedTriples = im.List([...triples])
                               .filter(t => !tribles.getInvariant(t.a).isUnique &&
                                            !tribles.getInvariant(t.a).isUniqueInverse);
  const indexByTriple = im.Map(im.List([...triples]).map((t, i) => [t, i]));
  
  const entities = im.Set([...triples]).map(t => t.e);
  
  let components = im.Set();
  for(const e of entities) {
    const work = [e];
    let visited = im.Set();
    let component = im.Set();
    while(work.length > 0) {
      const e = work.pop();
      if(visited.has(e)) continue;
      visited = visited.add(e);
      for(const t of uniqueTriples.get(e, [])) {
        component = component.add(indexByTriple.get(t));
        work.push(t.v);
      }
      for(const t of uniqueInverseTriples.get(e, [])) {
        component = component.add(indexByTriple.get(t));
        work.push(t.e);
      }
    }
    components = components.add(component);
  }
  for(const t of unconstrainedTriples) {
    components = components.add(im.Set([indexByTriple.get(t)]));
  }
  return components;
}
)}

function _CXN(im,VariableProvider,entities,mergeBindings,InitCXN,findUniquelyConnectedComponents){return(
class CXN extends im.Record({
  cxnId: null,
  matching: () => [],
  calling: (binding, kb, vars) => [binding],
  merging: () => []
}) {
  init(ns) {
    const vars = new VariableProvider();
    const [matching, matchingBinding] = entities(ns, this.matching, vars);
    const [merging, mergingBinding] = entities(ns, this.merging, vars);
    
    let constraintBinding = mergeBindings([matchingBinding, mergingBinding, vars.constraintBinding]);

    return new InitCXN({
      cxnId: this.cxnId,
      binding: constraintBinding,
      matching,
      calling: this.calling,
      merging,
      variables: im.List(vars.variables),
      matchingTripleSet: im.Set([...[...matching].keys()]),
      independentMatchingTripleSets: findUniquelyConnectedComponents(ns, matching)
    });
  }
}
)}

function _ExplainSourceCXN(md){return(
md`#### SourceCXN

As data, such as input words, becomes available in the shared knowledge base, it is picked up by reactive queries and, in turn, causes so-called SourceCXNs to fire.`
)}

function _SourceCXN(im,VariableProvider,entities,mergeBindings,InitSourceCXN){return(
class SourceCXN extends im.Record({
  cxnId: null,
  query: () => [],
  calling: (binding, kb, vars) => [binding],
  merging: () => []
}) {
  init(ns) {
    const vars = new VariableProvider();
    const [merging, mergingBinding] = entities(ns, this.merging, vars);

    const binding = mergeBindings([mergingBinding, vars.constraintBinding]);
    return new InitSourceCXN({
      cxnId: this.cxnId,
      query: this.query,
      binding,
      calling: this.calling,
      merging,
      variables: im.List(vars.variables),
    });
  }
}
)}

function _16(md){return(
md`### Grammar

The grammar holds all linguistic information needed for parsing.

#### Attributes:
 * _ns_: a namespace describing the grammar's attributes
 * _cxns_: holds all linguistic cxns
 * _precomps_: holds precomputed information on which matches could be the consequence of successful merges
 * _precompsForMerge_: maps the cxns to those precomps that employed the merging part of the respective cxn`
)}

function _Grammar(im){return(
class Grammar extends im.Record({
  ns: {},
  cxns: im.Map(),
  precomps: im.Map(),
  precompsForMerge: im.Map()
}) {}
)}

function _isPojo(){return(
(obj) => {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
}
)}

function _entities(tribles,Triple,unwrapDescription,emptyBinding,TripleIndex){return(
(ns, efn, vars) => {
  if (1 < efn.length) {
    throw new Error(
      "Passed more than one argument to entity creation function. You've most likely forgotten the map destructuring."
    );
  }
  const entities = efn(vars.namedVariableDescriptionsSource());
  const triplesWithPaths = tribles.entitiesToTriples(
    ns,
    () => vars.unnamedVariable(),
    entities
  );
  const triples = triplesWithPaths.map(({ triple: [e, a, v] }) => {
    const attributeDescription = ns.attributes.get(a);
    if (!attributeDescription.isInverse) {
      return new Triple({ e: unwrapDescription(e), a: attributeDescription.id, v: unwrapDescription(v) });
    } else {
      return new Triple({ e: unwrapDescription(v), a: attributeDescription.id, v: unwrapDescription(e) });
    }
  });
  let constraintBinding = emptyBinding;
  for (const t of triples) {
    if (tribles.getInvariant(t.a).isUnique) {
      constraintBinding = constraintBinding.attributeConstrained(t.a, t.e, t.v);
    }
    if (tribles.getInvariant(t.a).isUniqueInverse) {
      constraintBinding = constraintBinding.attributeConstrained(t.a, t.v, t.e);
    }
  }

  return [new TripleIndex().with(triples), constraintBinding];
}
)}

function _20(md){return(
md`## Search`
)}

function _21(md){return(
md`__Unification with constraint propagation__ Most computational work is pushed to an input-independent pre-computation step, see [below](#mergeMatchPrecompute), so parsing itself is reduced to unification with constraint propagation, which can be efficiently computed by using indeces.

__Chart parsing__ This also yields the ability to simultaneously explore and combine different interpretation hypotheses, similar to chart-based approaches.

__Deltas__ Inspiration from semi-naive Datalog evaluation: keeping track of deltas. Idea: a cxn can only match (apply), if at least one of the partials in the search space is new. Otherwise, it would have already applied beforehand. This means basically remembering the information about what is new and for which cxns these new partials are not already "used"`
)}

function _22(md){return(
md`### SearchSpace

#### Attributes:
 * _grammar_: holds all linguistic information, i.e. cxns, precomps and the context
 * _kbBox_: kowledge base
 * _cxnLog_: lists the cxns that have been or have been tried to apply
 * _nodes_: holds all nodes representing cxn applications
 * _partials_: holds all partial cxn applications that have already been "used"
 * _partialByCxnId_: partials mapped onto their respective merging cxn
 * _partialByIdAndIndex_: 
 * _queuedPartialsByCxnId_: fresh, unused, discovered, deltas, seeds, ...
 * _sourceCXNSubscriptions_: 
 * _sourceCXNQueryResults_: 
`
)}

function _SearchSpace(EventTarget,im,InitSourceCXN,tribles,coveringPartials,emptyBinding,mergeBindings,maximalConsistentSubsets){return(
class SearchSpace extends EventTarget {
  constructor(grammar, kbBox) {
    super();
    this.grammar = grammar;
    this.kbBox = kbBox;
    this.cxnLog = [];
    this.nodes = im.Map();
    this.partials = im.Map();
    this.partialByCxnId = im.Map();
    this.partialByIdAndIndex = im.Map();
    this.queuedPartialsByCxnId = grammar.cxns.map((cxn) => []);
    this.sourceCXNSubscriptions = im.Map();
    this.sourceCXNQueryResults = im.Map();

    for (const [cxnId, sourceCXN] of this.grammar.cxns.filter(
      (cxn) => cxn instanceof InitSourceCXN
    )) {
      this.sourceCXNQueryResults = this.sourceCXNQueryResults.set(
        cxnId,
        im.Set()
      );
      const subscription = (async () => {
        for await (const r of this.kbBox.subscribe(
          this.grammar.ns,
          sourceCXN.query
        )) {

          const result = im.Map(r);
          if (!this.sourceCXNQueryResults.get(sourceCXN.cxnId).has(result)) {
            this.sourceCXNQueryResults = this.sourceCXNQueryResults.update(
              sourceCXN.cxnId,
              (s) => s.add(result)
            );
            const { binding, variables } = sourceCXN.fresh();
            const queryBinding = binding.unifyAll(
              variables
                .filter((v) => result.has(v.name))
                .map((v) => [v, result.get(v.name)])
            );
            if (queryBinding.valid) {
              const newNodeId = tribles.UFOID.now();
              const newNode = {
                id: newNodeId,
                cxnId: sourceCXN.cxnId,
                explorationDepth: 0,
                parentNode: null,
                timestamp: Date.now(),
                parentPartials: im.Set(),
                unionVariables: variables,
                binding: queryBinding,
                ancestorNodes: im.Set(),
              };

              this.nodes = this.nodes.set(newNodeId, newNode);

              const newPartials = this.partialsForNode(newNodeId).filter(
                (p) => p.binding.valid
              );
              for (const partial of newPartials) {
                const partialId = partial.id;

                this.partials = this.partials.set(partialId, partial);

                this.queuedPartialsByCxnId = this.queuedPartialsByCxnId.update(
                  partial.cxnId,
                  (queue = []) => {
                    queue.push(partialId);
                    return queue;
                  }
                );
              }
              this.dispatchEvent(
                new CustomEvent("nodeAdded", { detail: { node: newNode } })
              );
              for (const partial of newPartials) {
                this.dispatchEvent(
                  new CustomEvent("partialQueued", { detail: { partial } })
                );
              }
            }
          }
        }
      })();
      this.sourceCXNSubscriptions = this.sourceCXNSubscriptions.set(
        sourceCXN.cxnId,
        subscription
      );
    }
  }

  // Tries to apply a cxn with cxnId in the search space.
  tick(cxnId = null) {
    if (!cxnId) {
      const cxnIds = [...this.grammar.cxns.keys()];
      cxnId = cxnIds[this.cxnLog.length % cxnIds.length];
    }
    this.cxnLog.push(cxnId);

    const cxn = this.grammar.cxns.get(cxnId);

    if (cxn.matchingTripleSet.isEmpty()) return [];

    const queue = this.queuedPartialsByCxnId.get(cxnId);
    if (queue.length === 0) return [];
    const seedPartial = this.partials.get(queue.pop());

    let newPartials = [];
    for (const { binding, variables, partials } of coveringPartials(
      cxnId,
      cxn.variables,
      seedPartial.id,
      this.partials,
      this.partialByIdAndIndex,
      cxn.matchingTripleSet
    )) {
      if (!binding.valid) continue;

      let callBindings;
      const calling = this.grammar.cxns.get(cxnId).calling;
      if (calling) {
        callBindings = calling(
          binding,
          this.kbBox.get(),
          Object.fromEntries(variables.map((v) => [v.name, binding.walk(v)]))
        )?.filter((b) => b.valid);
      } else {
        callBindings = [binding];
      }

      for (const callBinding of callBindings) {
        // Create a new node for each cxn application, i.e. each call binding.
        const newNodeId = tribles.UFOID.now();
        const newNode = {
          id: newNodeId,
          cxnId,
          explorationDepth:
            Math.max(
              ...partials.map(
                (id) => this.partials.get(id).parentNode.explorationDepth
              )
            ) + 1,
          timestamp: Date.now(),
          parentPartials: partials,
          unionVariables: variables,
          binding: callBinding,
          ancestorNodes: partials
            .map((id) =>
              im.Set([
                this.partials.get(id).parentNode.id,
                this.partials.get(id).parentNode.ancestorNodes,
              ])
            )
            .flatten(),
        };

        this.nodes = this.nodes.set(newNodeId, newNode);

        // Compute all new partials for each newly created node.
        for (const partial of this.partialsForNode(newNodeId)) {
          if (!partial.binding.valid) continue;

          const partialId = partial.id;

          newPartials.push(partial);

          this.partials = this.partials.set(partialId, partial);

          this.queuedPartialsByCxnId = this.queuedPartialsByCxnId.update(
            partial.cxnId,
            (queue = []) => {
              queue.push(partialId);
              return queue;
            }
          );
        }
        this.dispatchEvent(
          new CustomEvent("nodeAdded", { detail: { node: newNode } })
        );
        for (const partial of newPartials) {
          this.dispatchEvent(
            new CustomEvent("partialQueued", { detail: { partial } })
          );
        }
      }
    }

    this.partialByCxnId = this.partialByCxnId.update(
      seedPartial.cxnId,
      (a = im.Set()) => a.add(seedPartial.id)
    );
    for (const tripleIdx of seedPartial.touchedMatchTriples.values()) {
      this.partialByIdAndIndex = this.partialByIdAndIndex.update(
        im.List([seedPartial.cxnId, tripleIdx]),
        (a = im.Set()) => a.add(seedPartial.id)
      );
    }

    this.dispatchEvent(
      new CustomEvent("partialDequeued", { detail: { partial: seedPartial } })
    );

    return newPartials.map((p) => p.id);
  }

  // Merge sets of nodes together that represent parsing results.
  // A parsing result incorporates the most root nodes possible and combines those with 
  // all mergeable nodes from other, separate trees in the chart, again with a preference for nodes
  // on higher levels, to gather as much consistent knowledge from the parsing process as possible.
  generateParsingResults() {
    // Find all root nodes.
    const innerNodes = this.nodes.reduce(
      (acc, n) =>
        acc.union(
          im.Set(n.parentPartials.map((p) => this.partials.get(p).parentNode))
        ),
      im.Set()
    );
    const rootNodeConstraints = [
      ...this.nodes.toSet().subtract(innerNodes).values(),
    ];

    // Check for validity of binding that results from merging the constraints, aka. nodes.
    // Optionally, the constraints need to be mergeable in the context of an already given binding.
    const hardConstraint = (
      constraints,
      constraintsById,
      binding = emptyBinding
    ) => mergeBindings([binding, ...(binding === emptyBinding
        ? constraints
        : constraints.rest()).map(constraint => constraintsById[constraint].binding)]);

    let work = [
      {
        constraints: im.OrderedSet(rootNodeConstraints.keys()),
        k: -1,
        leftmost: false,
      },
    ];

    let rootResults = maximalConsistentSubsets(
      work,
      hardConstraint,
      rootNodeConstraints
    );
    let provisionals = rootResults.map(r => {
      return {
        deepestCheckedNodeConstraints: rootNodeConstraints,
        result: r,
      }});
    let results = [];

    while (provisionals.length > 0) {
      const {deepestCheckedNodeConstraints, result} = provisionals.shift();
      let augmentedResultFound = false;

      // Build up candidate node constraints from the current layer (i.e. parents of those nodes
      // that were already checked for mergeability with the hitherto constructed result).
      let nodeConstraints = im
        .Set(deepestCheckedNodeConstraints)
        .subtract(result.combinedNodes)
        .map((n) =>
          n.parentPartials.map((p) => this.partials.get(p).parentNode)
        )
        .flatten();

      // Filter out nodes that are ancestors of other nodes contained in nodeConstraints.
      // (These would not provide any additional knowledge.)
      nodeConstraints = [
        ...nodeConstraints
          .subtract(
            result.combinedNodes
              .map((n) => n.ancestorNodes)
              .flatten()
              .map((ancestor) => this.nodes.get(ancestor))
          )
          .subtract(
            nodeConstraints
              .map((n) => n.ancestorNodes)
              .flatten()
              .map((a) => this.nodes.get(a))
          ),
      ];

      // Once there are no more candidate ndoe constraints,
      // the existing result constitutes a valid parsing result.
      if (nodeConstraints.length === 0) results.push(result);
      else {
        work = [
          {
            constraints: im.OrderedSet([-1, ...nodeConstraints.keys()]),
            k: -1,
            leftmost: false,
          },
        ];

        // BFS of spanning tree of boolean lattice of subsets of constraints
        while (work.length > 0) {
          const { constraints, k, leftmost } = work.shift();
          const binding = hardConstraint(
            constraints,
            nodeConstraints,
            result.mergedBinding
          );
          if (binding.valid) {
            if (
              !constraints.isEmpty() &&
              !provisionals.some((p) => constraints.isSubset(p.result.constraints))
            ) {
              augmentedResultFound = true;
              provisionals.push({
                deepestCheckedNodeConstraints: nodeConstraints,
                result: {
                  mergedBinding: binding,
                  constraints: constraints,
                  combinedNodes: result.combinedNodes.union(
                    constraints.rest().map((i) => nodeConstraints[i])
                  ),
                },
              });
            }
          } else {
            if (
              leftmost ||
              hardConstraint(
                constraints.filter((i) => i < k),
                nodeConstraints,
                result.mergedBinding
              ).valid
            ) {
              let newLeftmost = true;
              constraints.forEach((i) => {
                if (k < i) {
                  work.push({
                    constraints: constraints.remove(i),
                    k: i,
                    leftmost: newLeftmost,
                  });
                  newLeftmost = false;
                }
              });
            }
          }
        }
        // If the current result could not be augmented with additional node constraints,
        // put it into the queue as is, so that in the next round, its mergeability
        // with other, deeper nodes can be checked.
        if (!augmentedResultFound) provisionals.push({deepestCheckedNodeConstraints, result});
      }
    }

    return results.map(r => r.combinedNodes.map(node => node.id));
  }

  // Compute all new partials for a given node.
  partialsForNode(nodeId) {
    const partials = [];
    const node = this.nodes.get(nodeId);
    for (const precompId of this.grammar.precompsForMerge.get(node.cxnId, [])) {
      const precomp = this.grammar.precomps.get(precompId);
      const {
        binding: precompBinding,
        mergingVariables,
        matchingVariables,
      } = precomp.fresh();

      const oldMatchingNewMergingPairs =
        node.unionVariables.zip(mergingVariables);
      const newBinding = mergeBindings([node.binding, precompBinding])
                          .unifyAll(oldMatchingNewMergingPairs);

      const partialId = tribles.UFOID.now();
      const partial = {
        id: partialId,
        precompId,
        cxnId: precomp.matchingId,
        mergedCxnId: precomp.mergingId,
        parentNode: node,
        matchingVariables,
        mergingVariables,
        binding: newBinding,
        touchedMatchTriples: precomp.touchedMatchTriples,
      };
      partials.push(partial);
    }
    return partials;
  }

  // Recover the resulting triples from the subtrees under given leaf nodes
  // by collecting all involved nodes' merge-triples
  // and binding the variables according to the established bindings.
  extractTS(leafNodeIds) {
    const leafNodes = leafNodeIds.map((nodeId) => this.nodes.get(nodeId));
    let binding = mergeBindings(leafNodes.map(node => node.binding));
    let ts = im.Set();
    const work = [...leafNodes];
    while (work.length !== 0) {
      const node = work.pop();
      if (node.cxnId) {
        const cxn = this.grammar.cxns.get(node.cxnId);
        const { variables, merging } = cxn.fresh();
        binding = binding.unifyAll(variables.zip(node.unionVariables));
        ts = ts.union(merging.toSet());
        work.push(
          ...node.parentPartials.map((p) => this.partials.get(p).parentNode)
        );
      }
    }
    return [ts.map((t) => binding.walkTriple(t)), binding];
  }
}
)}

function _maximalConsistentSubsets(){return(
function(work, hardConstraint, constraintsById) {
  let results = []
// BFS of spanning tree of boolean lattice of subsets of constraints
    while (work.length > 0) {
      const { constraints, k, leftmost } = work.shift();
      const binding = hardConstraint(constraints, constraintsById);
      if (binding.valid) {
        if (
          !constraints.isEmpty() &&
          !results.some((r) => constraints.isSubset(r.constraints))
        ) {
          results.push({
            mergedBinding: binding,
            constraints: constraints,
            combinedNodes: constraints.map((i) => constraintsById[i]),
          });
        }
      } else {
        if (
          leftmost ||
          hardConstraint(constraints.filter((i) => i < k), constraintsById).valid
        ) {
          let newLeftmost = true;
          constraints.forEach((i) => {
            if (k < i) {
              work.push({
                constraints: constraints.remove(i),
                k: i,
                leftmost: newLeftmost,
              });
              newLeftmost = false;
            }
          });
        }
      }
    }
  return results;
}
)}

function _25(md){return(
md`This function is used to compute the best combination of partials that enables a construction match (application). Employing indices and the greedy set cover heuristic, this problem can be computed efficiently.`
)}

function _excludedCombinationBinding(emptyBinding){return(
emptyBinding
  .set("valid", false)
  .set("error", { msg: "Result of excluded combination." })
)}

function _coveringPartials(Heap,im,mergeBindings){return(
function(
  cxnId,
  variables,
  seedPartialId,
  partials,
  partialByIdAndIndex,
  remainingTriples
) {
  const coverings = [];

  const seedPartial = partials.get(seedPartialId);
  const touchedMatchTriples = seedPartial.touchedMatchTriples;
  const workQueue = new Heap((a, b) => {
    //const partialsDiff = a.combinedPartials.size - b.combinedPartials.size;
    //if (partialsDiff !== 0) return partialsDiff;
    return a.remainingTriples.size - b.remainingTriples.size;
  });
  workQueue.init([
    {
      remainingSeedTriples: touchedMatchTriples,
      remainingTriples: remainingTriples.subtract(touchedMatchTriples),
      combinedPartials: im.Set([seedPartialId]),
      variables: seedPartial.matchingVariables,
      binding: seedPartial.binding
    }
  ]);

  while (workQueue.length > 0) {
    console.count(cxnId);
    const {
      remainingSeedTriples,
      remainingTriples,
      combinedPartials,
      variables,
      binding
    } = workQueue.pop();

    if (remainingSeedTriples.isEmpty()) continue;
    if (remainingTriples.isEmpty()) {
      if (!coverings.some(c => c.partials.isSubset(combinedPartials))) {
        coverings.push({ partials: combinedPartials, variables, binding });
        if(coverings.length >= 1) return coverings;
      }
      continue;
    }
    const coveredTriple = remainingTriples.first();

    for (const tripleCoveringPartial of partialByIdAndIndex.get(
      im.List([cxnId, coveredTriple]),
      []
    )) {
      const partial = partials.get(tripleCoveringPartial);
      const touchedMatchTriples = partial.touchedMatchTriples;

      const varPairs = variables.zip(partial.matchingVariables);
      const newBinding = mergeBindings([binding, partial.binding]).unifyAll(varPairs);
      if (newBinding.valid) {
        workQueue.push({
          remainingSeedTriples: remainingSeedTriples.subtract(
            touchedMatchTriples
          ),
          remainingTriples: remainingTriples.subtract(touchedMatchTriples),
          combinedPartials: combinedPartials.add(tripleCoveringPartial),
          variables,
          binding: newBinding
        });
      }
    }
  }

  console.log(`Found ${coverings.length} minimal coverings for ${cxnId}.`);

  return coverings;
}
)}

function _28(md){return(
md`### Partial

A partial match that can be combined with other partial matches until all triples of a cxn are covered, in which case they are then merged and used together with the precomps to create new partials for other cxns.

#### Attributes:
 * _id_: UUID,
 * _precompId_: the UUID of the precomp that was used to create this partial
 * _cxnId_: the UUID of the cxn that is partially matched
 * _mergedCxnId_: the UUID of the cxn that was merged and created this partial match
 * _parentNode_: the node that was used in the merge that created this partial
 * _matchingVariables_: the unique variables that were instantiated for this partial match
 * _mergingVariables_: the variables that were used in the merge creating merge
 * _binding_: the binding associated with this partial
 * _touchedMatchTriples_: the triples that are covered by this partial match`
)}

function _29(md){return(
md`### Node

#### Attributes
* _id_: UUID,
* _cxnId_: the id of the cxn whose application resulted in this node
* _parentPartials_: a set of partials that were used in the cxn application that created this node
* _explorationDepth_: the depth in the exploration graph
* _binding_: the binding associated with this node
* _timestamp_: the moment at which this node was created
* _ancestorNodes_: all parent nodes`
)}

function _30(md){return(
md`### Precomp

The potential matching consequences of merged triples. They are precomputed upon loading a grammar.

#### Attributes
 * _id_: UUID
 * _matchingId_: the UUID of the cxn whose matching part (partially) matches the merged triples
 * _mergingId_: the UUID of the cxn that provided its merged triples
 * _matchingVariables_:
 * _mergingVariables_:
 * _binding_: the binding that results from the (partial) merge-match combination
 * _touchedMatchTriples_: the indexes of those triples of the matching part that were used in this precomp
`
)}

function _Precomp(im,emptyBinding,tribles){return(
class Precomp extends im.Record({
  id: null,
  matchingId: null,
  mergingId: null,
  matchingVariables: im.List(),
  mergingVariables: im.List(),
  binding: emptyBinding,
  touchedMatchTriples: im.Set()
}) {
  fresh() {
    const matchingVariables = this.matchingVariables.map(v =>
      v.set("id", tribles.UFOID.now())
    );
    const mergingVariables = this.mergingVariables.map(v =>
      v.set("id", tribles.UFOID.now())
    );
    const matchingVariablesMapping = im.Map(
      this.matchingVariables.zip(matchingVariables)
    );
    const mergingVariablesMapping = im.Map(
      this.mergingVariables.zip(mergingVariables)
    );
    const binding = this.binding.rename(
      matchingVariablesMapping.merge(mergingVariablesMapping)
    );
    return this.set("binding", binding)
      .set("matchingVariables", matchingVariables)
      .set("mergingVariables", mergingVariables);
  }
}
)}

function _mergeMatchPrecompute(isVariable,im,mergeBindings){return(
(binding, merge, match, independentMatchingSet) => {
  const mergeVariables = merge
    .toSet()
    .flatMap(t => [t.e, t.v])
    .filter(v => isVariable(v));
  const matchVariables = match
    .toSet()
    .flatMap(t => [t.e, t.v])
    .filter(v => isVariable(v));

  const disjointEntities = im
    .Set()
    .union(
      mergeVariables.flatMap(e => mergeVariables.map(f => im.Set([e, f]))),
      matchVariables.flatMap(e => matchVariables.map(f => im.Set([e, f])))
    )
    .filter(p => p.size == 2);

  const pairs = [];
  const mergeTriples = [...merge];
  const matchTriples = [...match];
  mergeTriples.forEach(mergeTriple =>
    matchTriples.forEach((matchTriple, matchTripleIndex) => {
    if(independentMatchingSet.has(matchTripleIndex)) {
      const pairbinding = binding.unifyTriple(mergeTriple, matchTriple);
      if (pairbinding.valid) {
        pairs.push({
          binding: pairbinding,
          touchedMatchTriple: matchTripleIndex
        });
      }
    }})
  );

  let work = [
    { constraints: im.OrderedSet(pairs.keys()), k: -1, leftmost: false }
  ];
  let results = [];

  const hardConstraint = constraints => {
    let binding = mergeBindings(constraints.map(constraint => pairs[constraint].binding));
    if (
      binding.valid &&
      disjointEntities.some(([l, r]) => binding.walk(l) === binding.walk(r))
    ) {
      return binding
        .set("valid", false)
        .set("error", { msg: "Unification of disjoint entities." });
    }
    return binding;
  };

  // BFS of spanning tree of boolean lattice of subsets of constraints
  while (work.length > 0) {
    const { constraints, k, leftmost } = work.shift();
    const binding = hardConstraint(constraints);
    if (binding.valid) {
      if (
        !constraints.isEmpty() &&
        !results.some(r => constraints.isSubset(r.constraints))
      ) {
        results.push({
          precomputeBinding: binding,
          constraints: constraints,
          touchedMatchTriples: im.Set(
            constraints.map(i => pairs[i].touchedMatchTriple)
          )
        });
      }
    } else {
      if (leftmost || hardConstraint(constraints.filter(i => i < k)).valid) {
        let newLeftmost = true;
        constraints.forEach(i => {
          if (k < i) {
            work.push({
              constraints: constraints.remove(i),
              k: i,
              leftmost: newLeftmost
            });
            newLeftmost = false;
          }
        });
      }
    }
  }

  return results;
}
)}

function _33(md){return(
md`### InitCXN

The realisation of cxns inside a search space.

#### Attributes
* _cxnId_: UUID
* _binding_: contains the constraints, i.e. mappings of constrained attributes to their respective entities/values
* _matching_: the matching part of the cxn
* _calling_: the calling part of the cxn
* _merging_: the merging part of the cxn
* _variables_: holds all variables appearing inside the cxn
* _matchingTripleSet_: set of indices of match triples
* _independentMatchingTripleSets_: sets of indices of matching triples that are indpenendent from one another and thus need to result in different precomps`
)}

function _InitCXN(im,emptyBinding,tribles){return(
class InitCXN extends im.Record({
  cxnId: null,
  binding: emptyBinding,
  matching: null,
  calling: null,
  merging: null,
  variables: im.List(),
  matchingTripleSet: im.Set(),
  independentMatchingTripleSets: im.Set()
}) {
  fresh() {
    const variables = this.variables.map(v => v.set("id", tribles.UFOID.now()));
    const variablesMapping = im.Map(this.variables.zip(variables));
    const matching = this.matching.rename(variablesMapping);
    const merging = this.merging.rename(variablesMapping);
    const binding = this.binding.rename(variablesMapping);
    return this.set("binding", binding)
      .set("variables", variables)
      .set("matching", matching)
      .set("merging", merging);
  }
}
)}

function _InitSourceCXN(im,emptyBinding,TripleIndex,tribles){return(
class InitSourceCXN extends im.Record({
  cxnId: null,
  query: () => [],
  binding: emptyBinding,
  matching: new TripleIndex(), // Intentionally always empty!
  calling: null,
  merging: new TripleIndex(),
  variables: im.List(),
  matchingTripleSet: im.Set(),
  independentMatchingTripleSets: im.Set()
}) {
  fresh() {
    const variables = this.variables.map((v) =>
      v.set("id", tribles.UFOID.now())
    );
    const variablesMapping = im.Map(this.variables.zip(variables));
    const merging = this.merging.rename(variablesMapping);
    const binding = this.binding.rename(variablesMapping);
    return this.set("binding", binding)
      .set("variables", variables)
      .set("merging", merging);
  }
}
)}

function _36(md){return(
md`## Triples`
)}

function _37(md){return(
md`### Triple

Semantic triples, aka. [entity attribute value] tuples

#### Attributes
 * _e_: the entity, always a UUID
 * _a_: the attribute, always a UUID
 * _v_: the value, a UUID, if the triple represents a link, an atomic value otherwise`
)}

function _Triple(im){return(
class Triple extends im.Record({ e: null, a: null, v: null }) {
  toString() {
    return `${this.e} ${this.a} ${this.v}`;
  }
}
)}

function _TripleIndex(im){return(
class TripleIndex extends im.Record({
  triplesByAttr: im.Map()
}) {
  with(triples) {
    let tba = this.triplesByAttr.withMutations(tba => {
      for (const t of triples) {
        tba = tba.update(t.a, (ts = im.OrderedSet()) => ts.add(t));
      }
    });
    return this.set("triplesByAttr", tba);
  }

  remove(triple) {
    return this.updateIn(["triplesByAttr", triple.a], (ts = im.OrderedSet()) =>
      ts.remove(triple)
    );
  }

  isEmpty() {
    return this.triplesByAttr.every(ts => ts.isEmpty());
  }

  toSet() {
    return im.Set.union(this.triplesByAttr.values());
  }

  byAttribute(attr) {
    return this.triplesByAttr.get(attr, im.Set());
  }

  rename(renamings) {
    return this.update("triplesByAttr", tba =>
      tba.map(ts =>
        ts.map(t =>
          t
            .update("e", e => renamings.get(e, e))
            .update("v", v => renamings.get(v, v))
        )
      )
    );
  }

  *[Symbol.iterator]() {
    for (const [attr, triples] of this.triplesByAttr) {
      yield* triples;
    }
  }
}
)}

function _40(md){return(
md`## Variables, Bindings & Unification`
)}

function _VariableDescription(){return(
class VariableDescription {
  constructor(provider, variable) {
    this.variable = variable;
    this.provider = provider;
  }
  leq(other) {
    this.provider.constraintBinding =
      this.provider.constraintBinding.constrainBounds(
        this.variable,
        other.variable
      );
    return this;
  }
  geq(other) {
    this.provider.constraintBinding =
      this.provider.constraintBinding.constrainBounds(
        other.variable,
        this.variable
      );
    return this;
  }
}
)}

function _isVariableDescription(VariableDescription){return(
(d) => d instanceof VariableDescription
)}

function _unwrapDescription(isVariableDescription){return(
(d) => isVariableDescription(d)?d.variable:d
)}

function _VariableProvider(emptyBinding,Variable,tribles,VariableDescription){return(
class VariableProvider {
  constructor() {
    this.namedVariableDescriptions = new Map();
    this.variables = [];
    this.constraintBinding = emptyBinding;
  }

  namedVariableDescriptionsSource() {
    return new Proxy(
      {},
      {
        get: (_, name) => {
          let d = this.namedVariableDescriptions.get(name);
          if (d) {
            return d;
          }
          const variable = new Variable({ name, id: tribles.UFOID.now() });
          d = new VariableDescription(this, variable);
          this.namedVariableDescriptions.set(name, d);
          this.variables.push(variable);
          return d;
        },
      }
    );
  }
  unnamedVariable() {
    const variable = new Variable({
      name: "ANON",
      id: tribles.UFOID.now(),
    });
    this.variables.push(variable);
    return variable;
  }
}
)}

function _45(md){return(
md`### Variable

Placeholders that can be bound to other variables or atomic values during unification processes.

#### Attributes
* _name_: a suitable name, no need to be unique
* _id_: UUID`
)}

function _Variable(im){return(
class Variable extends im.Record({
  name: null,
  id: null
}) {
  toString() {
    return `?${this.name}:${this.id}`;
  }
}
)}

function _isVariable(Variable){return(
v => v instanceof Variable
)}

function _48(md){return(
md`Imposes an order on triple elements. In particular, atomic values are sorted "to the right" of variables.`
)}

function _orderUnifier(Variable){return(
(l, r) => {
  if (l instanceof Variable) {
    if (r instanceof Variable) {
      return l.id.localeCompare(r.id);
    }
    return -1;
  }
  if (r instanceof Variable) {
    return 1;
  }
  if (l === r) return 0;
  return null;
}
)}

function _50(md){return(
md`### Binding

The result of triple unification

#### Attributes
* _mapping_: holds the variable bindings, sorted as specified by orderUnifier
* _attributeConstraints_: maps all constrained attributes to their respective triples in order to enable checking the uniqueness constraints over those attributes
* _upperBounds_: maps variables to their upper bounds
* _lowerBounds_: maps variables to their lower bounds`
)}

function _walk(){return(
(mapping, u) => {
  let n = u;
  while (n !== undefined) {
    u = n;
    n = mapping.get(u);
  }
  return u;
}
)}

function _52(md,tex){return(
md`
# Attribute Constraints
Attribute constraints consist of a ${tex`\mathit{ifUnifier}`} an attribute key and a ${tex`\mathit{thenUnifier}`}.
And can be writen as a triple of the form ${tex`(\mathit{ifUnifier}, \mathit{attribute}, \mathit{thenUnifier})`}.

They express that whenever two ${tex`\mathit{ifUnifier}`} with matching matching attribute keys are unified, the ${tex`\mathit{thenUnifier}`} are also unified.
They are able to express both \`single value\` and \`single entity\` constraints on triples and can be seen as a lower-level primitive of these invariants.

The implementation uses mappings of the structure
${tex.block`\mathit{ifUnifier} \rightarrow (\mathit{attribute} \rightarrow \mathit{thenUnifier})`}
as a performance optimisation during lookup and merging of constraint sets.

Note that in this representation different invariants need to be maintained for the ${tex`\mathit{ifUnifier}`} and ${tex`\mathit{thenUnifier}`}. Since all operations work on representatives only, performing a \`walk\` step to attain them first, the ${tex`\mathit{ifUnifier}`} part of the mapping must also always be normalised to the representative in this binding. Conversely, since all operations perform a walk on the provided value anyways, the ${tex`\mathit{thenUnifier}`} need not follow this constraint. This allows limiting the renaming and walking operations to the ${tex`\mathit{ifUnifier}`} only.`
)}

function _mergeBindings(emptyBinding){return(
(bindings) => {
    for(const binding of bindings) {
      if(!binding.valid) return binding;
    }

    // I'm not sure if we have a bug in here.
    // Looking at this code now I'm not certain if and how it handles conditions
    // where a representative from one of the merged bindings has a different representative
    // in the other binding.
    // I suspect that in those cases the constraints won't get merged properly, as the merge
    // does not conflict (they are different keys after all), and the unifyAll which
    // should propagate these up at first glance will probably just short-cut to the
    // same representative twice in case the subsuming representative is in 'this'.
    // We probably don't hit this as a semantics breaking bug since attribute constraints
    // are very tightly coupled to the identity of a variable (as they are annotated at CXN
    // initialisation and variable creation) however this would still cause a minor resource leak.
    // The latter may be an option how to confirm this suspicion. Due to the way that only
    // representing variables are annotated with constraints in the unifyAll, there should be no
    // constrained variable that is not a representative, we could therefore search for such orphaned
    // constraints after merges.
    //
    // A possible fix would be to first perform the unification, and then re-apply the constraints
    // using the constraint map, walking each key and value in the newly created mapping, and then
    // performing a unification with those walked then-unifiers.
    //
    // We have to see if this also transfers to the bounds constraints.
    //
    // xoxo, your past self
    //

    let nbinding = emptyBinding;

    for(const binding of bindings) {
      nbinding = nbinding.unifyAll([...binding.mapping.entries()]);
    }
    
    for(const binding of bindings) {
      for(const [ifUnifier, attrMap] of binding.attributeConstraints.entries()) {
        for(const [attribute, thenUnifier] of attrMap) {
          nbinding = nbinding.attributeConstrained(attribute, ifUnifier, thenUnifier);
        }
      }
    }
      
    for(const binding of bindings) {
      for(const [lower, upperBounds] of binding.boundsConstraintsByLower.entries()) {
        for(const upper of upperBounds) {
          nbinding = nbinding.constrainBounds(lower, upper);
        }
      }
    }
    
    return nbinding;
}
)}

function _propagateLowerBound(walk,im){return(
(mapping, lowerBounds, upperBounds, constraintsByLower, root, lowerBound) => {
    const work = [root];
    while (work.length !== 0) {
      const current = walk(mapping, work.pop());
      const oldUpperBound = upperBounds.get(current, Number.POSITIVE_INFINITY);
      const oldLowerBound = lowerBounds.get(current, Number.NEGATIVE_INFINITY);
      if (lowerBound > oldUpperBound) return null;
      if (lowerBound > oldLowerBound) {
        // The bound has become tighter, and all bounds up the chain need to be moved.
        work.push(...constraintsByLower.get(current, im.Set()));
        lowerBounds = lowerBounds.set(current, lowerBound);
      }
    }
    return lowerBounds;
  }
)}

function _propagateUpperBound(walk,im){return(
(mapping, lowerBounds, upperBounds, constraintsByUpper, root, upperBound) => {
    const work = [root];
    while (work.length !== 0) {
      const current = walk(mapping, work.pop());
      const oldUpperBound = upperBounds.get(current, Number.POSITIVE_INFINITY);
      const oldLowerBound = lowerBounds.get(current, Number.NEGATIVE_INFINITY);
      if (oldLowerBound > upperBound) return null;
      if (oldUpperBound > upperBound) {
        // The bound has become tighter, and all bounds down the chain need to be moved.
        work.push(...constraintsByUpper.get(current, im.Set()));
        upperBounds = upperBounds.set(current, upperBound);
      }
    }
    return upperBounds;
  }
)}

function _renameKey(im){return(
(map, oldKey, newKey, resolver = ((oldValue, newValue) => oldValue)) => {
  if(map.has(oldKey)) {
    const oldValue = map.get(oldKey, im.Map())
    map = map.remove(oldKey);
    if(map.has(newKey)) {
      const newValue = map.get(newKey);
      map = map.set(newKey, resolver(oldValue, newValue));
    } else {
      map = map.set(newKey, oldValue);
    }
  }
  return map;
}
)}

function _max(){return(
(...args) => args.reduce((m, e) => e > m ? e : m)
)}

function _min(){return(
(...args) => args.reduce((m, e) => e < m ? e : m)
)}

function _Binding(im,walk,orderUnifier,renameKey,max,min,propagateLowerBound,propagateUpperBound,Triple){return(
class Binding extends im.Record({
  valid: true,
  mapping: im.Map(),
  attributeConstraints: im.Map(),
  boundsConstraintsByLower: im.Map(),
  boundsConstraintsByUpper: im.Map(),
  upperBounds: im.Map(),
  lowerBounds: im.Map(),
  error: null,
}) {
  walk(u) {
    return walk(this.mapping, u);
  }

  unifyAll(q) {
    if (!this.valid) {
      return this;
    }

    q = [...q];
    let nmapping = this.mapping.asMutable();
    let nAttributeConstraints = this.attributeConstraints.asMutable();
    let nBoundsConstraintsByLower = this.boundsConstraintsByLower.asMutable();
    let nBoundsConstraintsByUpper = this.boundsConstraintsByUpper.asMutable();
    let nUpperBounds = this.upperBounds.asMutable();
    let nLowerBounds = this.lowerBounds.asMutable();

    while (q.length !== 0) {
      const [u, v] = q.shift();
      let ru = walk(nmapping, u);
      let rv = walk(nmapping, v);

      const ord = orderUnifier(ru, rv);
      if (ord === null)
        return this.set("valid", false).set("error", {
          msg: "Does not unify.",
          left: ru,
          right: rv,
        });
      if (ord === 0) continue;

      if (ord > 0) {
        [ru, rv] = [rv, ru];
      } // From now on we know that ru < rv!

      const nAttributeConstraint = nAttributeConstraints
        .get(ru, im.Map())
        .mergeWith((ruc, rvc, attribute) => {
          q.push([ruc, rvc]);
          return ruc;
        }, nAttributeConstraints.get(rv, im.Map()));

      nAttributeConstraints = nAttributeConstraints
        .remove(ru)
        .set(rv, nAttributeConstraint);

      nmapping = nmapping.set(ru, rv);

      nBoundsConstraintsByLower = renameKey(
        nBoundsConstraintsByLower,
        ru,
        rv,
        (o, n) => o.union(n).map((c) => walk(nmapping, c))
      );
      nBoundsConstraintsByUpper = renameKey(
        nBoundsConstraintsByUpper,
        ru,
        rv,
        (o, n) => o.union(n).map((c) => walk(nmapping, c))
      );

      const isNumeric = (typeof rv === "number") || (typeof rv === "bigint");
      const newLowerBound = isNumeric
        ? rv
        : max(
            nLowerBounds.get(ru, Number.NEGATIVE_INFINITY),
            nLowerBounds.get(rv, Number.NEGATIVE_INFINITY)
          );
      const newUpperBound = isNumeric
        ? rv
        : min(
            nUpperBounds.get(ru, Number.POSITIVE_INFINITY),
            nUpperBounds.get(rv, Number.POSITIVE_INFINITY)
          );

      nLowerBounds = propagateLowerBound(
        nmapping,
        nLowerBounds,
        nUpperBounds,
        nBoundsConstraintsByLower,
        rv,
        newLowerBound
      );
      if (nLowerBounds === null)
        return this.set("valid", false).set("error", {
          msg: "Inconsistent bounds.",
          left: ru,
          right: rv,
        });

      nUpperBounds = propagateUpperBound(
        nmapping,
        nLowerBounds,
        nUpperBounds,
        nBoundsConstraintsByUpper,
        rv,
        newUpperBound
      );
      if (nUpperBounds === null)
        return this.set("valid", false).set("error", {
          msg: "Inconsistent bounds.",
          left: ru,
          right: rv,
        });
    }

    return this.set("mapping", nmapping.asImmutable())
      .set("attributeConstraints", nAttributeConstraints.asImmutable())
      .set("boundsConstraintsByLower", nBoundsConstraintsByLower.asImmutable())
      .set("boundsConstraintsByUpper", nBoundsConstraintsByUpper.asImmutable())
      .set("lowerBounds", nLowerBounds.asImmutable())
      .set("upperBounds", nUpperBounds.asImmutable());
  }

  unifyTriple(left, right) {
    if (!this.valid) {
      return this;
    }

    if (left.a !== right.a)
      return this.set("valid", false).set("error", {
        msg: "Does not unify.",
        left: left.a,
        right: right.a,
      });
    return this.unifyAll([
      [left.e, right.e],
      [left.v, right.v],
    ]);
  }

  attributeConstrained(attribute, ifUnifier, thenUnifier) {
    if (!this.valid) return this;

    const ifUnifierRepresentative = this.walk(ifUnifier);

    const existingThenUnifier = this.getIn([
      "attributeConstraints",
      ifUnifierRepresentative,
      attribute,
    ]);

    if (existingThenUnifier) {
      return this.unifyAll([[existingThenUnifier, thenUnifier]]);
    } else {
      return this.setIn(
        ["attributeConstraints", ifUnifierRepresentative, attribute],
        thenUnifier
      );
    }
  }

  constrainBounds(lower, upper) {
    const lowerRepresentative = this.walk(lower);
    const upperRepresentative = this.walk(upper);
    if (lowerRepresentative === upperRepresentative) return this;

    const upperBoundOfUpper = this.getIn(
      ["upperBounds", upperRepresentative],
      Number.POSITIVE_INFINITY
    );
    const lowerBoundOfLower = this.getIn(
      ["lowerBounds", lowerRepresentative],
      Number.NEGATIVE_INFINITY
    );

    let nbinding = this.updateIn(
      ["boundsConstraintsByLower", lowerRepresentative],
      im.Set(),
      (cons) => cons.add(upperRepresentative)
    ).updateIn(
      ["boundsConstraintsByUpper", upperRepresentative],
      im.Set(),
      (cons) => cons.add(lowerRepresentative)
    );

    const nUpperBounds = propagateUpperBound(
      this.mapping,
      this.lowerBounds,
      this.upperBounds,
      this.boundsConstraintsByUpper,
      lowerRepresentative,
      upperBoundOfUpper
    );
    if (nUpperBounds === null) {
      return this.set("valid", false).set("error", {
        msg: "Couldn't add inconsistent bounds constraint.",
        lower,
        upper,
      });
    }
    nbinding = nbinding.set("upperBounds", nUpperBounds);

    const nLowerBounds = propagateLowerBound(
      this.mapping,
      this.lowerBounds,
      nUpperBounds,
      this.boundsConstraintsByLower,
      upperRepresentative,
      lowerBoundOfLower
    );
    if (nLowerBounds === null) {
      return this.set("valid", false).set("error", {
        msg: "Couldn't add inconsistent bounds constraint.",
        lower,
        upper,
      });
    }
    nbinding = nbinding.set("lowerBounds", nLowerBounds);

    return nbinding;
  }

  // Substitutes the triple's entity and value variables with their respective rightmost representatives.
  walkTriple(triple) {
    return new Triple({
      e: this.walk(triple.e),
      a: triple.a,
      v: this.walk(triple.v),
    });
  }

  // Note: Only works with fresh variables that don't introduce additional unification!
  rename(renamings) {
    // First we need to build a new binding with a rebuilt mapping.
    // This is because of the fact that replacing a variable might replace the
    // representative itself in which case we need to rebuild the mapping graph.
    //
    let newBinding = this;
    // unions because mapping is essentially a union-find datastructure
    const unions = im
      .Set([...newBinding.mapping.entries()].flat()) // all elements from mapping
      .groupBy((unwalked) => this.walk(unwalked)); // group all elements by their representative
    const newUnions = renamings
      .entrySeq()
      .reduce(
        (unions, [replaced, replacer]) =>
          unions.update(this.walk(replaced), (union = im.Set()) =>
            union.remove(replaced).add(replacer)
          ),
        unions
      );
    // We pick a new representative from each union.
    const newMapping = im.Map(
      newUnions.valueSeq().flatMap((union) => {
        const representative = union.max(orderUnifier);
        return union
          .remove(representative)
          .map((unionItem) => [unionItem, representative]);
      })
    );
    newBinding = newBinding.set("mapping", newMapping);
    // Then we can use this new binding, which has a mapping that is compatible with
    //our replacement map to also update its constraints.

    newBinding = newBinding.update(
      "attributeConstraints",
      (attributeConstraints) =>
        attributeConstraints.mapEntries(([ifUnifier, attrMap]) => [
          newBinding.walk(renamings.get(ifUnifier, ifUnifier)),
          attrMap.mapEntries(([attr, thenUnifier]) => [
            attr,
            renamings.get(thenUnifier, thenUnifier),
          ]),
        ])
    );
    newBinding = newBinding.update(
      "boundsConstraintsByLower",
      (boundsConstraintsByLower) =>
        boundsConstraintsByLower.mapEntries(([lower, upper]) => [
          newBinding.walk(renamings.get(lower, lower)),
          upper.map((u) => newBinding.walk(renamings.get(u, u))),
        ])
    );
    newBinding = newBinding.update(
      "boundsConstraintsByUpper",
      (boundsConstraintsByUpper) =>
        boundsConstraintsByUpper.mapEntries(([upper, lower]) => [
          newBinding.walk(renamings.get(upper, upper)),
          lower.map((l) => newBinding.walk(renamings.get(l, l))),
        ])
    );
    newBinding = newBinding.update("lowerBounds", (lowerBounds) =>
      lowerBounds.mapEntries(([lower, bound]) => [
        newBinding.walk(renamings.get(lower, lower)),
        bound,
      ])
    );
    newBinding = newBinding.update("upperBounds", (upperBounds) =>
      upperBounds.mapEntries(([upper, bound]) => [
        newBinding.walk(renamings.get(upper, upper)),
        bound,
      ])
    );
    return newBinding;
  }
}
)}

function _emptyBinding(Binding){return(
new Binding()
)}

function _62(md,bibliography){return(
md`# References
${bibliography()}`
)}

function _bibliography_references(im){return(
im.Set()
)}

function _bib_fresh(){return(
false
)}

function _65(md){return(
md`# Import`
)}

async function _Heap(){return(
(await import('https://unpkg.com/heap-js@2.1.5/dist/heap-js.es5.js?module'))
  .Heap
)}

function _im(require){return(
require('immutable@4.0.0-rc.12')
)}

function _tribles(require){return(
require("tribles@0.8.2/dist/tribles.js")
)}

function _70(md){return(
md`# TODOs 📋`
)}

function _71(md){return(
md`### Backlog`
)}

function _72(md){return(
md`- Reintroduce nodes (lazy partial generation?)`
)}

function _73(md){return(
md`- More documentation`
)}

function _74(md){return(
md`- Reintroduce tags for filtering the transient structure`
)}

function _75(md){return(
md`- There is a search strategy that decides which cxns to fire at a given time.`
)}

function _76(md){return(
md`- Check whether the poison idea makes sense.`
)}

function _77(md){return(
md`### Doing`
)}

function _78(md){return(
md`- 🦟🔨`
)}

function _79(md){return(
md`### Done`
)}

function _80(md){return(
md`- Correctly merge TSs from multiple nodes`
)}

function _81(md){return(
md`- Make bestPartialFit complete, i.e. return set of all combinable partials. Maybe via weighted set cover problem (e.g. number of atoms, entities, ...)`
)}

function _82(md){return(
md`- Parsimony merging at the end for gathering diverged subbranches that together constitute a valid parsing`
)}

function _83(md){return(
md`- Remove introduces? Should still work?`
)}

function _84(md){return(
md`- Sanity check: Is match able to collapse (i.e. merge) structures that were repeatedly created by merges?`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","ref"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("wordNamespace")).define("wordNamespace", ["tribles"], _wordNamespace);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("introduce")).define("introduce", _introduce);
  main.variable(observer("grammar")).define("grammar", ["im","SourceCXN","CXN","mergeBindings","mergeMatchPrecompute","Precomp","tribles","Grammar"], _grammar);
  main.variable(observer("parser")).define("parser", ["SearchSpace"], _parser);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md","ref"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("findUniquelyConnectedComponentsOld")).define("findUniquelyConnectedComponentsOld", ["im","tribles"], _findUniquelyConnectedComponentsOld);
  main.variable(observer("findUniquelyConnectedComponents")).define("findUniquelyConnectedComponents", ["im","tribles"], _findUniquelyConnectedComponents);
  main.variable(observer("CXN")).define("CXN", ["im","VariableProvider","entities","mergeBindings","InitCXN","findUniquelyConnectedComponents"], _CXN);
  main.variable(observer("ExplainSourceCXN")).define("ExplainSourceCXN", ["md"], _ExplainSourceCXN);
  main.variable(observer("SourceCXN")).define("SourceCXN", ["im","VariableProvider","entities","mergeBindings","InitSourceCXN"], _SourceCXN);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("Grammar")).define("Grammar", ["im"], _Grammar);
  main.variable(observer("isPojo")).define("isPojo", _isPojo);
  main.variable(observer("entities")).define("entities", ["tribles","Triple","unwrapDescription","emptyBinding","TripleIndex"], _entities);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("SearchSpace")).define("SearchSpace", ["EventTarget","im","InitSourceCXN","tribles","coveringPartials","emptyBinding","mergeBindings","maximalConsistentSubsets"], _SearchSpace);
  main.variable(observer("maximalConsistentSubsets")).define("maximalConsistentSubsets", _maximalConsistentSubsets);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("excludedCombinationBinding")).define("excludedCombinationBinding", ["emptyBinding"], _excludedCombinationBinding);
  main.variable(observer("coveringPartials")).define("coveringPartials", ["Heap","im","mergeBindings"], _coveringPartials);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("Precomp")).define("Precomp", ["im","emptyBinding","tribles"], _Precomp);
  main.variable(observer("mergeMatchPrecompute")).define("mergeMatchPrecompute", ["isVariable","im","mergeBindings"], _mergeMatchPrecompute);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("InitCXN")).define("InitCXN", ["im","emptyBinding","tribles"], _InitCXN);
  main.variable(observer("InitSourceCXN")).define("InitSourceCXN", ["im","emptyBinding","TripleIndex","tribles"], _InitSourceCXN);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("Triple")).define("Triple", ["im"], _Triple);
  main.variable(observer("TripleIndex")).define("TripleIndex", ["im"], _TripleIndex);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("VariableDescription")).define("VariableDescription", _VariableDescription);
  main.variable(observer("isVariableDescription")).define("isVariableDescription", ["VariableDescription"], _isVariableDescription);
  main.variable(observer("unwrapDescription")).define("unwrapDescription", ["isVariableDescription"], _unwrapDescription);
  main.variable(observer("VariableProvider")).define("VariableProvider", ["emptyBinding","Variable","tribles","VariableDescription"], _VariableProvider);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("Variable")).define("Variable", ["im"], _Variable);
  main.variable(observer("isVariable")).define("isVariable", ["Variable"], _isVariable);
  main.variable(observer()).define(["md"], _48);
  main.variable(observer("orderUnifier")).define("orderUnifier", ["Variable"], _orderUnifier);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("walk")).define("walk", _walk);
  main.variable(observer()).define(["md","tex"], _52);
  main.variable(observer("mergeBindings")).define("mergeBindings", ["emptyBinding"], _mergeBindings);
  main.variable(observer("propagateLowerBound")).define("propagateLowerBound", ["walk","im"], _propagateLowerBound);
  main.variable(observer("propagateUpperBound")).define("propagateUpperBound", ["walk","im"], _propagateUpperBound);
  main.variable(observer("renameKey")).define("renameKey", ["im"], _renameKey);
  main.variable(observer("max")).define("max", _max);
  main.variable(observer("min")).define("min", _min);
  main.variable(observer("Binding")).define("Binding", ["im","walk","orderUnifier","renameKey","max","min","propagateLowerBound","propagateUpperBound","Triple"], _Binding);
  main.variable(observer("emptyBinding")).define("emptyBinding", ["Binding"], _emptyBinding);
  main.variable(observer()).define(["md","bibliography"], _62);
  main.define("initial bibliography_references", ["im"], _bibliography_references);
  main.variable(observer("mutable bibliography_references")).define("mutable bibliography_references", ["Mutable", "initial bibliography_references"], (M, _) => new M(_));
  main.variable(observer("bibliography_references")).define("bibliography_references", ["mutable bibliography_references"], _ => _.generator);
  main.define("initial bib_fresh", _bib_fresh);
  main.variable(observer("mutable bib_fresh")).define("mutable bib_fresh", ["Mutable", "initial bib_fresh"], (M, _) => new M(_));
  main.variable(observer("bib_fresh")).define("bib_fresh", ["mutable bib_fresh"], _ => _.generator);
  main.variable(observer()).define(["md"], _65);
  main.variable(observer("Heap")).define("Heap", _Heap);
  main.variable(observer("im")).define("im", ["require"], _im);
  const child1 = runtime.module(define1);
  main.import("bibliography", child1);
  main.import("ref", child1);
  main.variable(observer("tribles")).define("tribles", ["require"], _tribles);
  main.variable(observer()).define(["md"], _70);
  main.variable(observer()).define(["md"], _71);
  main.variable(observer()).define(["md"], _72);
  main.variable(observer()).define(["md"], _73);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer()).define(["md"], _75);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer()).define(["md"], _77);
  main.variable(observer()).define(["md"], _78);
  main.variable(observer()).define(["md"], _79);
  main.variable(observer()).define(["md"], _80);
  main.variable(observer()).define(["md"], _81);
  main.variable(observer()).define(["md"], _82);
  main.variable(observer()).define(["md"], _83);
  main.variable(observer()).define(["md"], _84);
  return main;
}
