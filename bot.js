const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();


const config = require("./config.json");
const sql = require("sqlite");
sql.open("./score.sqlite");

// iiiii am readyyyyyy
client.on('ready', () => {
  console.log('I am ready!');
});
var opt = ['spock', 'scissors', 'rock', 'paper', 'lizard'];
var moji = ['\:vulcan:', '\:scissors:', '\:full_moon_with_face:', '\:newspaper:', '\:lizard:'];

var uss = new Array(opt.length);
for (var i = 0; i < opt.length; i++) {
    uss[i] = '!' + opt[i];
}
// Create an event listener for messages

client.on('message', message => {
  if (message.channel.type === "dm") return; 


  function rpsls() {
    for (var i = 0; i < opt.length; i++) {

      if (message.content === uss[i]) {
        var resp = opt[Math.floor(Math.random()*opt.length)];
        
        var gene = moji[opt.indexOf(resp)];
        message.reply(gene);

        // remove the " ! "
        var uso = message.content.substr(1);
        
        // its a tie
        if (resp === uso) {
          message.channel.send('tie');
          return 0.5;
        } else if (opt.indexOf(resp) > opt.indexOf(uso)) {
          if (opt.indexOf(uso) === 1 && opt.indexOf(resp) === 3) {
            message.channel.send('you win');
            return 1;
          }else if (opt.indexOf(uso) == 0 && opt.indexOf(resp) == 1) {
            message.channel.send('you win');
            return 1;
          }else if (opt.indexOf(uso) == 0 && opt.indexOf(resp) == 2) {
            message.channel.send('you win');
            return 1;
          }else {
            message.channel.send('you lose');
            return 0;
          }
        } else {
          if (opt.indexOf(resp) === 1 && opt.indexOf(uso) === 0) {
            message.channel.send('you lose');
            return 0;
          } else if (opt.indexOf(resp) == 0 && opt.indexOf(uso) == 4) {
            message.channel.send('you lose');
            return 0;
          } else {
            message.channel.send('you win');
            return 1;
          }
        }
      }
    }
  }

  if (!message.content.startsWith(config.prefix)) return; // Ignore messages that don't start with the prefix
  
  if (message.content.startsWith(config.prefix + "level")) {
      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("Your current level is 0");
        message.reply(`Your current level is ${row.level}`);
      });
  } else if (message.content.startsWith(config.prefix + "points")) {
      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("sadly you do not have any points yet!");
        message.reply(`you currently have ${row.points} points, good going!`);
      });
  }
  function addp() {
    sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      } else { // Can find the row.
      let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
      if (curLevel > row.level) {
          row.level = curLevel;
          sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
          message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
      }
      sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`); 
      }
    }).catch(() => {
      console.error; 
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      });
    });
  }
  if (rpsls() === 1) {
    addp();
  }
});
// Log our bot in
client.login(config.token);
