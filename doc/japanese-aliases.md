## Japanese Aliases

Gomi originally started out as a project for myself to learn more about langauge design, parser design and interpreters. As I continued to learn more I thought more about what kind of features I would like to make Gomi not just another scripting language.

Then it occurred to me. At the time of writing I work for a Japanese company and oftentimes when I'm working I have to input Japaneses strings. I find it mildly frustrating when I have to switch my input method between Japanese and English to type programs. So I decided a fun feature to add to Gomi would be to provide Japanese aliases for as many keywords and operators as possible. This allows me to write Gomi programs without ever switching the input method. Granted this is a very niche feature (and after further deliberation I don't think this is a good idea for a production level language at all). But regardless I kept implementing it because I thought it was fun and very trivial to do so as it mostly just meant more enums in my lexer.

Below are all the aliases but you can easily find them if you look in the lexer source code.


| English       | Japanese         |
|:--------------|:-----------------|
|module         |モジュール         |
|import         |インポート         |
|=              |＝                 |
|(              |（                 |
|)              | ）                |
|[              |【                 |
|]              |】                 |
|{              |｛                 |
|}              |｝                 |
|:              |：                 |
|.              |。                 |
|;              |；                 |
|,              |、，               |
|?              |？                 |
|!              |！                 |
|#              |＃                 |
|'              |”                  |
|func           |関数               |
|while          |繰り返す           |
|let            |宣言               |
|const          |定数               |
|nil            |無                 |
|true           |本当               |
|false          |嘘                 |
|if             |もし               |
|+              |＋                 |
|-              | n/a               |
|*              |＊                 |
|/              |／                 |
|^              |＾                 |
|%              |％                 |
|>              |＞                 |
|<              |＜                 |
| \|\|          | ｜｜              |
| &&            | ＆＆              |
|>=             |＞＝               |
|<=             |＜＝               |
|==             |＝＝               |
|!=             |！＝               |

Here is a translation of a sample program.

```
# english.gomi

module '/trees.gomi' import { dfs }

func printSquare(n) {
    n ^ 2
}

const tree = {
    val: 1,
    left: nil
    right: {
        val: 2,
        left: nil
        right: nil
    }
};

dfs(tree, printSquare)
```
Here is an equivalent program without any English with the exception of the module imports (you could always have Japanese identifiers as well in your import).
```
# 日本語.gomi

モジュール '/trees.gomi' インポート　｛ dfs ｝

関数　平方数（数）｛
    数＾２
｝

定数　木＝｛
    価値：１、
    左：無、
    右：｛
        価値：２、
        左：無、
        右：無
    ｝
｝

dfs（木、平方数）
```
However, in the output all keywords are in English.

[Previous: Grammar](./grammar.md)

[Next: Contributions](./contributions.md)