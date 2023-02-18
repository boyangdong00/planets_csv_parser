const parse = require("csv-parse");
const { createReadStream } = require("fs");
const prompts = require("prompts");
const ps = require("prompts");

const results = [];

// // Planets have been confirmed and insol (amount of lights) has be greater than 0.36 and lower than max 1.11
// // Indicate if possible life form can appear on the planets
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

//   console.log(`${results.length} number of planets has been founded`);

const cli_questions = [
  {
    type: "text",
    name: "csv_filepath",
    message: "Please enter csv filepath",
    initial: "cumulative_2023.02.15_07.54.00.csv", // default sample file
  },
  {
    type: "text",
    name: "habitable",
    message: "Do you want to see planets that habitable?",
    initial: "yes",
  },
];

const cli_prompts = async () => {
  const resp = await prompts(cli_questions);
  const filepath = resp.csv_filepath;

  createReadStream(filepath)
    .pipe(
      parse({
        comment: "#",
        columns: true,
        // relax_column_count: true
      })
    ) // readable stream to a writable stream
    .on("data", (data) => {
      if (isHabitablePlanet(data) && resp.habitable.toLowerCase() === "yes") {
        results.push(data);
      }
    })
    .on("error", (err) => {
      console.log(err);
    })
    .on("end", () => {
      console.log(
        results.map((p) => {
          return p["kepler_name"];
        })
      );
    });
};

cli_prompts();
