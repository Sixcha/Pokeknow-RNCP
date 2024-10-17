const fs = require('fs').promises;
const mysql = require('mysql2/promise');

(async () => {
  console.log("Starting script...");

const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 6666,
  user: 'user',
  password: 'password',
  database: 'pokeknow'
});
console.log("Connected to the database");

async function insertPokemonStats(data) {
  const query = `
    INSERT INTO PokemonStats (no, name, type1, type2, hp, strength, max_strength, dexterity, max_dexterity,
      vitality, max_vitality, special, max_special, insight, max_insight, ability1, ability2, hidden_ability,
      event_abilities, unevolved, has_form, recommended_rank, gender_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  for (const row of data) {
    const no = row["No."].replace("#", "");
    console.log("Inserting PokemonStats for:", row.Name);
    await connection.execute(query, [
      no, row["Name"], row["Type 1"], row["Type 2"], row["HP"], row["Strength"], row["Max Strength"],
      row["Dexterity"], row["Max Dexterity"], row["Vitality"], row["Max Vitality"], row["Special"], row["Max Special"],
      row["Insight"], row["Max Insight"], row["Ability 1"], row["Ability 2"], row["Hidden Ability"],
      row["Event Abilities"], row["Unevolved?"] === "Yes", row["Has a form?"] === "Yes", row["Recommended Rank"], row["Gender Type"]
    ]);
  }
}

async function insertPokemonMoves(data) {
  const query = `INSERT INTO PokemonMoves (pokemon_no, move_name, move_rank, pokemon_name) VALUES (?, ?, ?, ?)`;
  for (const row of data) {
    console.log("Inserting PokemonMoves for:", row["Number & Name"]);
    const pokemonNo = row["Number & Name"].split(" ")[0];
    console.log(pokemonNo)
    const pokemonName = row["Number & Name"].split(" ")[1];
    for (let i = 1; i <= 28; i++) {
      const moveName = row[`Move ${i}`];
      const moveRank = row[`Rank ${i}`];
      if (moveName && moveRank) {
        await connection.execute(query, [pokemonNo, moveName, moveRank, pokemonName]);
      }
    }
  }
}

async function insertPokemonAbilities(data) {
  const query = `INSERT INTO PokemonAbilities (name, effect, description) VALUES (?, ?, ?)`;
  for (const row of data) {
    await connection.execute(query, [row["Name"], row["Effect"], row["Description"]]);
  }
}

async function insertMoveDetails(data) {
  const query = `
    INSERT INTO MoveDetails (movename, type, damagetype, damagedice, damagestat, seconddamagestat,
      accuracydice, secondaccuracydice, target, special, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  for (const row of data) {
    await connection.execute(query, [
      row["Movename"], row["Type"], row["Damagetype"], row["Damagedice"], row["Damagestat"],
      row["Seconddamagestat"], row["Accuracydice"], row["Secondaccuracydice"], row["Target"],
      row["Special"], row["Description"]
    ]);
  }
}


async function parseJson(filePath, insertFunction) {
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
  console.log(`Inserting data from: ${filePath}`);
  await insertFunction(data);
  console.log(`Data successfully imported from: ${filePath}`);
}


{
  try {
    await parseJson('./PokeLearnStats.json', insertPokemonStats);
    await parseJson('./PokeLearnMovesFull.json', insertPokemonMoves);
    await parseJson('./PokeRoleAbilities.json', insertPokemonAbilities);
    await parseJson('./PokeMoveSorted.json', insertMoveDetails);
  } catch (error) {
    console.error(`Error processing JSON files: ${error}`);
  } finally {
    await connection.end();
  }
}
})();
