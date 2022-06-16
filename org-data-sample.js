const relations = {
  parent: "categ_id_0",
  categ_id_0: { c_c: ["categ_id_1", "categ_id_2"] },
  categ_id_1: { s_c: ["categ_id_3"] },
  categ_id_2: { s_c: ["categ_id_4", "categ_id_5"] },
};

const orgs = {
  categ_id_0: {
    id: "categ_id_0",
    name: "Freemasonry",
  },
  categ_id_1: {
    id: "categ_id_1",
    name: "Rite",
  },
  categ_id_2: {
    id: "categ_id_2",
    name: "Appendant Bodies",
  },
  categ_id_3: {
    id: "categ_id_3",
    name: "Scottish Rite",
    synonyms: ["Scottish", "Scottish Perfection Lodges"],
    jurisdictions: [{ code: "TX", name: "USA" }],
  },
  categ_id_4: {
    id: "categ_id_4",
    name: "Blue Lodge",
    synonyms: ["Scottish", "Scottish Perfection Lodges"],
    jurisdictions: [
      { code: "TX", name: "USA" },
      { code: "LA", name: "USA" },
    ],
  },
  categ_id_5: {
    id: "categ_id_5",
    name: "Chapter Degrees",
    synonyms: ["Royal Arch", "Royal Chapter"],
    jurisdictions: [{ code: "CA", name: "USA" }],
  },
};

// output
const org_tree = {
  categ_id_0: {
    id: "categ_id_0",
    name: "Freemasonry",
    c_c: {
      categ_id_1: {
        id: "categ_id_1",
        name: "Rite",
        s_c: {
          categ_id_3: {
            id: "categ_id_3",
            name: "Scottish Rite",
            synonyms: ["Scottish", "Scottish Perfection Lodges"],
            jurisdictions: [
              {
                code: "TX",
                name: "USA",
              },
            ],
          },
        },
      },
      categ_id_2: {
        id: "categ_id_2",
        name: "Appendant Bodies",
        s_c: {
          categ_id_4: {
            id: "categ_id_4",
            name: "Blue Lodge",
            synonyms: ["Scottish", "Scottish Perfection Lodges"],
            jurisdictions: [
              {
                code: "TX",
                name: "USA",
              },
              {
                code: "LA",
                name: "USA",
              },
            ],
          },
          categ_id_5: {
            id: "categ_id_5",
            name: "Chapter Degrees",
            synonyms: ["Royal Arch", "Royal Chapter"],
            jurisdictions: [
              {
                code: "CA",
                name: "USA",
              },
            ],
          },
        },
      },
    },
  },
};

class CustomTree {
  full_map = {};

  constructor(props) {
    const { relations, orgs, rel_types } = props;
    if (!relations || !relations.parent || !orgs || !orgs[relations.parent] || !rel_types.length)
      throw new Error("Invalid inputs");
    this.relations = relations;
    this.orgs = orgs;
    this.rel_types = rel_types;
  }

  add({ item_id, rel_type, item }) {
    if (
      this.relations[item_id] &&
      this.relations[item_id][rel_type] &&
      this.relations[item_id][rel_type].length
    ) {
      if (!item[rel_type]) item[rel_type] = {};
      this.relations[item_id][rel_type].forEach(c_item => {
        if (!this.orgs[c_item]) return;
        item[rel_type][c_item] = { ...this.orgs[c_item] };
        this.addRelations(c_item, item[rel_type][c_item]);
      });
    }
  }

  addRelations(item_id, item) {
    if (!this.relations[item_id]) return null;
    this.rel_types.forEach(rel_type => this.add({ item_id, rel_type, item }));
  }

  getFullTree() {
    this.full_map[this.relations.parent] = { ...this.orgs[this.relations.parent] };
    this.addRelations(this.relations.parent, this.full_map[this.relations.parent]);
    return this.full_map;
  }
}

const customTree = new CustomTree({ relations, orgs, rel_types: ["c_c", "s_c"] });
const full_map = customTree.getFullTree();

console.log(JSON.stringify(full_map, null, 2));
