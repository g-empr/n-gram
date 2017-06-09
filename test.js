var kuromoji = require('kuromoji');
var fs = require('fs');

// builder = 形態素解析用オブジェクト
var builder = kuromoji.builder({
  // 辞書があるパス（kuromoji.js）を指定
  dicPath: 'node_modules/kuromoji/dict'
});

// 形態素解析機生成メソッド
builder.build(function(err, tokenizer) {
  // 辞書がない場合のエラー処理
  if(err) { throw err; }

  // tokenizer.tokenize に文字列を渡しその文を形態素解析
  var tokens = tokenizer.tokenize("うちの猫ねこが、傷きずだらけになって帰かえってきた。他ほかの猫ねことけんかをしたみたいだ。");
  console.dir(tokens);
  // txtに出力
  var writeTokens = JSON.stringify(tokens, null , "\t"); 
  fs.writeFile('output.txt', writeTokens , function (err) {
      console.log(err);
  });
});

