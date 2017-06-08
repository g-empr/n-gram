var fs = require('fs');

// kuromoji 周りの設定とか
var kuromoji = require('kuromoji');
var builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

// マルコフ連鎖の実装
class Markov {
  constructor(n) {
    this.data = {};
  }

  // データ登録
  add(words) {
    for(var i = 0; i <= words.length; i++) {
      var now = words[i];
      if(now === undefined) { now = null };
      var prev = words[i - 1];
      if(prev === undefined) { prev = null };

      if(this.data[prev] === undefined) {
        this.data[prev] = [];
      }
      this.data[prev].push(now);
    }
  }

  // 指定された文字に続く文字をランダムに返す
  sample(word) {
    var words = this.data[word];
    if(words === undefined) { words = []; }

    return words[Math.floor(Math.random() * words.length)];
  }

  // マルコフ連鎖でつなげた文を返す
  make() {
    var sentence = [];
    var word = this.sample(null);
    while(word) {
      sentence.push(word);
      word = this.sample(word);
    }
    return sentence.join('');
  }
}

var markov = new Markov();

builder.build(function(err, tokenizer) {
  if(err) { throw err; }

  // アシタカ先輩の台詞を読み込む
  fs.readFile('list.txt', 'utf8', function(err, data) {
    if(err) { throw err; }

    var lines = data.split("\n"); // 一行ごとに分割
    lines.forEach(function(line) {
      var tokens = tokenizer.tokenize(line);

      // トークンを文中表記にすべて変換
      var words = tokens.map(function(token) {
        return token.surface_form;
      });

      // データを登録
      markov.add(words);
    });

    // 10回くらい生成してみる
    for(var n = 0; n < 10; n++) {
      console.log(markov.make());
    }
  });
});