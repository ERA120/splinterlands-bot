const cards = require('./getCards.js');

const summoners = [{ 224: 'dragon' },
{ 27: 'earth' },
{ 16: 'water' },
{ 156: 'life' },
{ 189: 'earth' },
{ 167: 'fire' },
{ 145: 'death' },
{ 5: 'fire' },
{ 71: 'water' },
{ 114: 'dragon' },
{ 178: 'water' },
{ 110: '' },
{ 49: 'death' },
{ 88: 'dragon' },
{ 38: 'white' },
{ 236: '' },
{ 74: 'death' },
{ 200: '' },
{ 70: '' },
{ 109: '' },
{ 111: '' },
{ 130: '' },
{ 72: '' },
{ 112: '' },
{ 235: '' },
{ 56: '' },
{ 113: '' },
{ 73: 'life' }]

const summonerColor = (id) => {
    const summonerDetails = summoners.find(x => x[id]);
    return summonerDetails ? summonerDetails[id] : '';
}

const history = require("./data/newHistory.json");
//const myCards = require('./data/myCards.js');
const basicCards = require('./data/splinterlavaCards.js');
const getCards = require('./data/advancedCards');

async function myCards() {
    const advanced = await getCards.getAdvancedCards('splinterlava');
    return basicCards.concat(advanced);
}


let availabilityCheck = (base, toCheck) => toCheck.slice(0, 7).every(v => base.includes(v));

const battlesFilterByManacap = (mana, ruleset) => history.filter(
    battle =>
        battle.mana_cap == mana &&
        (ruleset ? battle.ruleset === ruleset : true)
)

const cardsIds = (mana, ruleset, splinters) => battlesFilterByManacap(mana, ruleset, splinters)
    .map(
        (x) => {
            return [
                x.summoner_id,
                x.monster_1_id,
                x.monster_2_id,
                x.monster_3_id,
                x.monster_4_id,
                x.monster_5_id,
                x.monster_6_id,
                summonerColor(x.summoner_id) ? summonerColor(x.summoner_id) : ''
            ]
        }
    ).filter(
        team => splinters.includes(team[7])
    )


//for (i=13; i<100; i++) {

// const manaCap = 22;
// const inactive = ['White']

const askFormation = async function (matchDetails) {
    const myCards = await myCards()
    return cardsIds(matchDetails.mana, matchDetails.rules, matchDetails.splinters)
        .filter(
            x => availabilityCheck(myCards, x))
        .map(element => element)//cards.cardByIds(element)

}

const possibleTeams = (matchDetails) => {
    let possibleTeams = [];
    while (matchDetails.mana > 0) {
        possibleTeams = askFormation(matchDetails)
        if (possibleTeams.length > 0) {
            return possibleTeams;
        }
        matchDetails.mana--;
    }
    return possibleTeams;
}

module.exports.possibleTeams = possibleTeams;
// const summoners = history.map(x => x.summoner_id);

// // console.log([...new Set(summoners)])
// console.log(summonerColor(27))

// // TO TEST uncomment below:
// const matchDetails = { mana: 11, rules: 'Standard' }
// console.log(possibleTeams(matchDetails))