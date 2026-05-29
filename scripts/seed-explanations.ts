// Expanded grammar explanations — much more detail than the inline seed.
// Run after seed:genki to overlay these onto the existing grammar points.
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

const EXPL: Record<string, string> = {
  // ============== Lesson 1 ==============
  "genki-l1-1-wa-desu": `
## What it is

The most basic Japanese sentence pattern: **X は Y です** — *X is Y* (X equals Y).

## Structure

\`\`\`
[Topic] + は + [Predicate noun/na-adjective] + です
\`\`\`

- **は** (pronounced **wa** in this role, not *ha*) marks the topic of the sentence — the thing you're talking about.
- **です** is the polite copula — it links the topic to a predicate. Plain (casual) form: **だ**.
- This pattern connects a noun (or な-adjective) to another noun (or な-adjective). For verbs, use the verb directly with no です.

## Full conjugation table

|  | Polite | Plain |
|---|---|---|
| Present positive | XはYです | XはYだ |
| Present negative | XはYじゃないです / XはYじゃありません | XはYじゃない |
| Past positive | XはYでした | XはYだった |
| Past negative | XはYじゃなかったです / XはYじゃありませんでした | XはYじゃなかった |

Both **じゃないです** and **じゃありません** are used; the first is more colloquial, the second more formal. Both are correct.

## When to use は vs が

- **は** introduces or reminds about a topic that's already in the air: 私**は**学生です (As for me, I'm a student).
- **が** identifies which one — answers a *who* or *which* question: 私**が**学生です (I'm the one who is the student).

For your first 50 sentences, use **は**. が only enters with question words like 誰 (who).

## Common mistakes

- Writing は as *ha* sound — it's pronounced **wa** when it's the topic particle.
- Forgetting です at the end of polite sentences: 私は学生 (incomplete) vs 私は学生です ✓.
- Using **でした** for verbs — でした is only for nouns/な-adj. Verbs have their own past form (ました).

## Casual speech

In casual speech, だ is often dropped after a noun:
- 学生だ → 学生 (just "student")
- きれいだ → きれい
- But だ stays before particles like ね, よ: 学生だね.
`,

  "genki-l1-2-question-ka": `
## What it is

The particle **か** turns any statement into a yes/no or wh-question.

## Structure

\`\`\`
[Statement] + か
\`\`\`

Just append か to a polite statement.

## Examples

- Statement: メアリーさんは学生です (Mary is a student).
- Question: メアリーさんは学生です**か** (Is Mary a student?).

- Statement: 今、何時です (It's some time now…)
- Wh-question: 今、何時です**か** (What time is it?)

## Punctuation note

In Japanese, **the か already serves as a question mark**. Traditional Japanese writing uses 。 (period) at the end, not ？. Modern casual writing sometimes adds ？ on top for emphasis, especially in chat — but in textbook/formal writing, **か。** is standard.

## Casual speech

In informal speech, か is often **dropped** and the question is shown by rising intonation:
- Polite: 学生です**か**？
- Casual: 学生? (with rising tone)

Sometimes の replaces か in casual female speech: 学生な**の**？

## When NOT to use か

- After a plain form for casual yes/no question (use rising tone only): 行く？ ✓ / 行くか? sounds rough/masculine.
- For tag questions like "right?", use **ね** instead: 学生です**ね** (You're a student, right?).

## Common mistakes

- Adding か AFTER ですか? — only one か needed.
- Forgetting か and relying on intonation in polite speech — sounds incomplete.
`,

  "genki-l1-3-no-modifier": `
## What it is

**A の B** is a structural pattern that links two nouns. The first noun (A) modifies / describes / owns the second (B).

## Three main meanings

1. **Possession** — A's B: 私**の**本 (my book), 田中さん**の**車 (Tanaka's car)
2. **Category / affiliation** — A's B / B of A: 東京大学**の**学生 (a Tokyo University student), 日本語**の**先生 (Japanese-language teacher)
3. **Specification / type** — B that is A: 木**の**いす (a wooden chair, a chair of wood)

## Structure

\`\`\`
[Noun A] + の + [Noun B]
\`\`\`

No spaces. You can chain multiple の: 私**の**友達**の**お父さん**の**車 (my friend's father's car).

## When you DON'T use の

- Between a な-adjective and a noun: use **な**, not の. きれい**な**花 ✓ (NOT きれいの花)
- Between an い-adjective and a noun: nothing. 大きい本 ✓ (NOT 大きいの本)
- Between two adjectives describing the same noun: use the て-form. 大きく**て**新しい家 (a big and new house).

## Stand-alone の (pronoun)

の can also be a *pronoun* meaning "one":
- 赤い**の** = the red one
- 私**の** = mine

So 私の傘 = my umbrella, but 私の = mine (without specifying the noun).

## Common mistakes

- Mixing up な-adj + な vs noun + の: 学生**の**先生 ✓ (a teacher-who-is-a-student / student teacher), きれい**な**花 ✓ NOT きれい**の**花.
- Forgetting の between two nouns: 日本語先生 ✗ → 日本語**の**先生 ✓.
- Using の after い-adjectives: 大きい**の**本 ✗ → 大きい本 ✓.

## Building sentences

Combine with です: 私**の**本**です** (It's my book).
`,

  // ============== Lesson 2 ==============
  "genki-l2-1-kosoado": `
## What it is

The **こ・そ・あ・ど** (kosoado) demonstrative system: *this / that / that over there / which*.

## Two forms

| | Stand-alone (thing) | + Noun (this X) | Location (here / there) |
|---|---|---|---|
| Near speaker | これ this | この + noun | ここ here |
| Near listener | それ that | その + noun | そこ there |
| Far from both | あれ that over there | あの + noun | あそこ over there |
| Question | どれ which | どの + noun | どこ where |

## Stand-alone vs attributive

- **これ・それ・あれ** stand on their own and act as pronouns: **これは**本です (This is a book).
- **この・その・あの** must be followed by a noun: **この本**は重い (This book is heavy).

Do NOT mix them: ✗ これ本 / ✗ この (without a noun).

## Choosing こ / そ / あ

Like English this/that, but with three levels based on distance:

- **こ**: in your hand, on your desk, very close to you
- **そ**: in the other person's hand, on their desk, close to them
- **あ**: visible but far from both, OR something you both know about that isn't physically present

If both speakers don't share the same physical reference (e.g. talking on phone), use **そ** to refer to what the listener mentioned, and **あ** for shared knowledge.

## When the topic is "what is it":

- **これは何ですか** (What is this?) — pointing at something near you
- **そこは何ですか** is wrong if you mean "what is this place" — use **ここは何ですか** if you're there.

## Common mistakes

- Using これ/それ/あれ before a noun: ✗ これ本 → ✓ これは本です / この本.
- Confusing そ (near listener) vs あ (far from both).
`,

  "genki-l2-2-mo": `
## What it is

The particle **も** means *too / also / as well*. It extends a previous statement to apply to a new item.

## Structure

It **replaces** は or を (not adds to them):

\`\`\`
私は学生です。トムさんも学生です。
(I'm a student. Tom is also a student.)
\`\`\`

NOT 私はトムさんはも学生です ✗.

## Where it goes

- After the topic: 私**も**好きです (I also like it).
- After the object — replacing を: コーヒーを飲みます。お茶**も**飲みます (I drink coffee. I drink tea too).

## Two もs in one sentence

You can use **も**…**も** to mean *both A and B / neither A nor B*:

- 肉**も**魚**も**食べます (I eat both meat and fish).
- 肉**も**魚**も**食べません (I don't eat meat or fish).

## も with numbers

When attached to a number, **も** means *as many as / as much as*, expressing surprise at the amount:

- 三回**も**行きました (I went there as many as three times!)

## Common mistakes

- Saying 私はも → ✗. **Replace** は with も, don't stack: 私**も** ✓.
- Forgetting that も replaces を too: コーヒー**を**飲みます → お茶**も**飲みます ✓ (NOT お茶**をも** ✗).
- Using も at the start of a sentence as English "also" — Japanese も attaches to the noun, not the sentence.
`,

  // ============== Lesson 3 ==============
  "genki-l3-1-masu-form": `
## What it is

The **ます-form** is the basic polite verb conjugation. It's how you say *I do / will do / am doing* something in polite speech — the standard form for talking to strangers, colleagues, and anyone you're not on casual terms with.

## Three verb groups

Every Japanese verb belongs to one of three groups, each with its own rule for making the ます-form.

### Group 1: Ru-verbs (一段, ichidan)

Drop the final る, add ます:
- 食べる → 食べ**ます** (to eat)
- 見る → 見**ます** (to see)
- 寝る → 寝**ます** (to sleep)

### Group 2: U-verbs (五段, godan)

Change the final う-row syllable (う/く/す/つ/ぬ/ぶ/む/る) to its い-row equivalent, then add ます:
- 飲**む** → 飲**み**ます (mu → mi)
- 書**く** → 書**き**ます (ku → ki)
- 話**す** → 話**し**ます (su → shi)
- 待**つ** → 待**ち**ます (tsu → chi)
- 買**う** → 買**い**ます (u → i)
- ある → あり**ます** (an u-verb!)

### Group 3: Irregular

Only two truly irregular verbs:
- する → **します** (to do)
- 来る (くる) → **きます** (to come)

## Telling ru-verbs from u-verbs

Both 食べる (ru-verb) and ある (u-verb) end in る. How do you tell them apart?

- Verbs ending in **eru / iru** are usually ru-verbs: 食べる (taberu), 見る (miru).
- But common exceptions exist: 帰る (kaeru — u-verb!), 入る (hairu — u-verb!), 走る (hashiru — u-verb!), 切る (kiru — u-verb!).
- All other endings (au, ou, ku, su, etc.) are u-verbs.

**Memorize the group when you learn each new verb** — it's the single most important grammatical fact about it.

## Tense variations of ます

| | Polite |
|---|---|
| Present / future positive | 食べ**ます** |
| Present / future negative | 食べ**ません** |
| Past positive | 食べ**ました** |
| Past negative | 食べ**ませんでした** |

## Future and present share a form

Japanese doesn't distinguish between *present habitual* and *near future* in the ます-form. 食べます = "I eat / I will eat", clarified by time words:
- 毎日食べます = I eat every day.
- 明日食べます = I'll eat tomorrow.

## Common mistakes

- Using ます with everything: 学生**ます** ✗ — ます only attaches to verbs, never to nouns or adjectives.
- Conjugating exception verbs as ru-verbs: 帰る → ✗ 帰ます → ✓ 帰**り**ます (it's an u-verb).
- Saying 来ります (kirimasu) for 来る → ✗ — it's irregular, **きます**.
`,

  "genki-l3-2-particles": `
## What it is

Four high-frequency action particles that determine the grammatical role of nouns relative to verbs:

- **を** (wo, pronounced "o") — direct object
- **で** (de) — location of an action (or means)
- **に** (ni) — specific time, direction, or destination
- **へ** (e) — direction (interchangeable with に for motion)

## を — direct object

Marks what the verb acts on:
- 本**を**読みます (I read **a book**)
- 水**を**飲みます (I drink **water**)
- テレビ**を**見ます (I watch **TV**)

Note: written as を but pronounced **o**.

## で — location where an action happens

Different from に: で marks the *setting* of an action, while に marks a destination or static existence.

- カフェ**で**コーヒーを飲みます (I drink coffee **at** a café).
- 図書館**で**勉強します (I study **at** the library).

Also **で** marks the *means/tool*: バス**で**行きます (I go **by** bus), ペン**で**書きます (I write **with** a pen).

## に — time / destination / existence

Three main uses at this level:

1. **Specific time**: 七時**に**起きます (I wake up **at** 7).
2. **Destination of motion**: 学校**に**行きます (I go **to** school).
3. **Existence location**: 机の上**に**本があります (There's a book **on** the desk).

Used with: 行く, 来る, 帰る, ある, いる, 住む, 入る.

When NOT to use に for time:
- General time words (今日, 明日, 昨日, 毎日) don't take に: 明日行きます ✓ (NOT 明日**に**行きます).
- Specific points (七時, 月曜日, 三月) DO take に: 月曜日**に**行きます ✓.

## へ — direction

Almost interchangeable with に for motion. Slightly more "directional/poetic":
- 東京**へ**行きます = 東京**に**行きます (I go to Tokyo).

But に has more uses (time, existence). For destination, either works; for existence and specific time, only に.

## Particle comparison

|  | Function | Example |
|---|---|---|
| を | direct object | 本**を**読む |
| で | location of action | カフェ**で**飲む |
| に | destination / time / existence | 学校**に**行く |
| へ | direction | 東京**へ**行く |

## Common mistakes

- Using で for destination: ✗ 学校**で**行く → ✓ 学校**に**行く.
- Using に for action location: ✗ カフェ**に**飲む → ✓ カフェ**で**飲む.
- Adding に to "today/tomorrow": ✗ 明日**に** → ✓ 明日.
- Writing を as お — they sound the same but only を is the particle.
`,

  "genki-l3-3-masenka": `
## What it is

Two polite suggestion patterns:

- **〜ませんか** — *Won't you...? / Would you like to...?* (invitation)
- **〜ましょう** — *Let's...* (suggestion)
- **〜ましょうか** — *Shall we...?* (asking if the other person wants to)

All built from the ます-form.

## Formation

| | Form | English nuance |
|---|---|---|
| ます-form | 食べます | I/we eat |
| 〜ませんか | 食べませんか | Won't you eat? / Would you like to eat? |
| 〜ましょう | 食べましょう | Let's eat. |
| 〜ましょうか | 食べましょうか | Shall we eat? |

## Why 〜ませんか and not 〜ますか?

Both ask a question, but the *negative* form is more polite — it gives the listener room to decline:

- 食べ**ますか** (Will you eat? — sounds blunt or demanding)
- 食べ**ませんか** (Won't you eat? — soft invitation, easier to decline)

This is similar to English *"Won't you join us?"* vs *"Will you join us?"* — the negative version is gentler.

## Examples

- 一緒に映画を見**ませんか** (Would you like to watch a movie together?)
- そろそろ食べ**ましょう** (Let's start eating soon.)
- お茶を飲み**ましょうか** (Shall we have some tea?)

## Polite vs casual

- Polite: 行き**ませんか** / 行き**ましょう**
- Casual: 行かない？ / 行こう (using plain forms — covered later)

## Common mistakes

- Using 〜ますか for an invitation — sounds too direct: ✗ 一緒に行きますか? → ✓ 一緒に行き**ませんか**?
- Using 〜ましょう for someone else's action: 行きましょう means *let's go*, including you. To suggest someone else does something, you need てください or similar.
- Mixing 〜ましょう and 〜ませんか — they're not interchangeable. ましょう = "let's", ませんか = "won't you".
`,

  // ============== Lesson 4 ==============
  "genki-l4-1-iru-aru": `
## What it is

Two verbs for *there is / exists*, depending on whether the subject is animate or inanimate:

- **います** — for **animate** beings (people, animals, fish — anything with a mind/movement)
- **あります** — for **inanimate** things (objects, plants, buildings, abstract concepts)

## Basic pattern

\`\`\`
[Location] + に + [Thing] + が + あります／います
\`\`\`

- 机の上**に**本**が**あります (There's a book on the desk.)
- 公園**に**猫**が**います (There's a cat in the park.)

The location takes **に** (where it exists), and the existing thing takes **が** (subject marker — what exists).

## Reversed pattern: focus on the thing

If you want to put the thing first, use **は** instead of が:

- 田中さん**は**図書館**に**います (Tanaka is at the library.)

Here 田中さん is the topic; we want to say *where Tanaka is*. The と is が only when answering "what's there?" — in topic form, は.

## Animate / inanimate edge cases

- **Plants** are inanimate → あります. 木があります.
- **Robots and dolls**: usually あります (no autonomy).
- **Vehicles**: usually あります (objects), but if focusing on the driver inside, can be います.
- **Dead things / corpses**: usually あります.

## Possession (I have X)

Same pattern but with は:

- 私**は**車**が**あります (I have a car.) — literally "as for me, there's a car"
- 妹**が**います (I have a younger sister.) — animate → います

This is the standard way to say *have* in Japanese.

## Conjugation

| | あります | います |
|---|---|---|
| Polite negative | ありません | いません |
| Polite past | ありました | いました |
| Plain | ある | いる |
| Plain negative | **ない** (irregular) | いない |

Note: ある's plain negative is **ない**, not あらない.

## Common mistakes

- Using あります for people: ✗ 田中さんはあります → ✓ 田中さんはいます.
- Using います for objects: ✗ 本がいます → ✓ 本があります.
- Forgetting に on the location: ✗ 机本があります → ✓ 机**の上に**本があります.
- Replacing に with で: で is for action locations (verbs of motion/activity), に is for existence.
`,

  "genki-l4-2-past-desu": `
## What it is

Past-tense conjugation of the copula です (was/were) and how to do it negatively.

## Full table

| | Polite | Plain |
|---|---|---|
| Non-past positive | です | だ |
| Non-past negative | じゃないです / じゃありません | じゃない |
| Past positive | **でした** | **だった** |
| Past negative | **じゃなかったです** / じゃありませんでした | **じゃなかった** |

## Two forms of negative past

Both are correct:
- **じゃなかったです** — more colloquial, common in everyday polite speech.
- **じゃありませんでした** — more formal, common in business/written contexts.

## Use only with nouns and な-adjectives

- 学生でした ✓ (I was a student.)
- 静かでした ✓ (It was quiet.)
- 元気でした ✓ (I was healthy/energetic.)

**Verbs** have their own past form (ました). **い-adjectives** use かったです (大きかったです, NOT 大きいでした).

## Common verbs/adjectives that LOOK like nouns but aren't

- **嫌い** (dislike) is a na-adjective: 嫌い**でした** ✓ NOT 嫌い**ました** ✗.
- **きれい** (pretty) — looks like an i-adjective (ends in い in writing) but is a na-adjective: きれい**でした** ✓.

## Common mistakes

- Adding ました to a noun: ✗ 学生**ました** → ✓ 学生**でした**.
- Mixing じゃなかった + でした: ✗ じゃなかったでした → ✓ じゃなかったです.
- Using でした for verbs: ✗ 食べでした → ✓ 食べ**ました**.
- Using でした for i-adjectives: ✗ 大きいでした → ✓ 大きかったです.
`,

  // ============== Lesson 5 ==============
  "genki-l5-1-adjectives": `
## What it is

Japanese has two adjective types that conjugate differently. Knowing which is which is essential.

## い-adjectives

End in **い** (in their dictionary form) and conjugate the い part for tense.

Examples: 大きい, 小さい, 新しい, 古い, 高い, 安い, 寒い, 暑い, 楽しい, 忙しい, おいしい, つまらない, 面白い.

### Conjugation

| | Form |
|---|---|
| Present positive | 大き**い**です |
| Present negative | 大き**くない**です |
| Past positive | 大き**かった**です |
| Past negative | 大き**くなかった**です |

The pattern: drop い → add 〜くない / 〜かった / 〜くなかった as needed, then optionally add です for politeness.

### Modifying a noun

Just place the い-adjective before the noun. **No connector needed.**
- 大き**い**本 (a big book)
- 新し**い**車 (a new car)

## な-adjectives

End in any sound (usually NOT い, but there are exceptions like きれい). They conjugate like nouns + the copula です.

Examples: 静か, 元気, 親切, 便利, きれい (looks like an i-adj but isn't!), 有名, 好き, 嫌い, 上手, 下手, 大切.

### Conjugation

| | Form |
|---|---|
| Present positive | 静か**です** |
| Present negative | 静か**じゃないです** |
| Past positive | 静か**でした** |
| Past negative | 静か**じゃなかったです** |

Same as the copula です — easy if you've memorized です conjugation.

### Modifying a noun

Add **な** between the adjective and the noun:
- 静か**な**部屋 (a quiet room)
- きれい**な**花 (a pretty flower)

This **な** is the source of the name "な-adjective".

## The いい exception

**いい** (good) is an い-adjective but uses an alternate stem **よ** for conjugation:

- いい → よ**くない** (not good)
- いい → よ**かった** (was good)
- いい → よ**くなかった** (wasn't good)

This is because いい evolved from older よし. Always use the よ-stem when conjugating.

## Sneaky な-adjectives that end in い

- **きれい** (pretty) — na-adj
- **嫌い** (dislike) — na-adj

If unsure, check the dictionary — it tells you which type it is.

## Common mistakes

- Using **な** with an i-adjective before a noun: ✗ 大きい**な**本 → ✓ 大きい本.
- Using **の** between i-adjective and noun: ✗ 大きい**の**本 → ✓ 大きい本.
- Conjugating きれい as if it were i-adj: ✗ きれくない → ✓ きれい**じゃないです**.
- Forgetting to drop い: ✗ 大きいくない → ✓ 大きくない.
`,

  "genki-l5-2-suki-kirai": `
## What it is

How to say you like or dislike something in Japanese. The key surprise: 好き and 嫌い are **な-adjectives** (not verbs!), and the thing you like is marked with **が** (not を).

## Basic pattern

\`\`\`
[Person] は [Thing] が 好き／嫌い です
\`\`\`

- 私は寿司**が**好きです (I like sushi.)
- 彼は野菜**が**嫌いです (He dislikes vegetables.)

## Why が, not を?

Because 好き/嫌い are adjectives describing the *thing*, not actions you do *to* the thing. が marks the subject (what the description applies to). Think of it as "Sushi is liked by me" rather than "I like sushi".

## Levels of like/dislike

| Word | Meaning |
|---|---|
| 大好き | really like / love |
| 好き | like |
| ちょっと好き | sort of like |
| あまり好きじゃない | don't really like |
| 嫌い | dislike |
| 大嫌い | really hate |

## Negative

Use じゃないです (na-adj rule):
- 好きじゃないです (don't like)
- 嫌いじゃないです (don't dislike — i.e. somewhat OK)

## Modifying nouns

- 好きな食べ物 (favorite food)
- 嫌いな食べ物 (food I dislike)

Don't forget **な** (since they're na-adj!).

## Asking what someone likes

- 何が好きですか (What do you like?)
- 寿司が好きですか (Do you like sushi?)

## Common mistakes

- Using **を** with 好き: ✗ 寿司**を**好きです → ✓ 寿司**が**好きです.
- Treating 好き as a verb: ✗ 好きします → ✓ 好きです.
- Using 嫌い casually about people — it's strong, like "hate". Soften to 好きじゃない.
- Forgetting **な**: ✗ 好き食べ物 → ✓ 好き**な**食べ物.
`,

  // I'll add condensed but still-richer explanations for the rest to keep the file practical.
  // Each remaining entry expands the original by 1.5-2× with structure, mistakes, comparisons.

  "genki-l6-1-te-form": `
## What it is

The **て-form** (te-form) is the workhorse of Japanese grammar. By itself it doesn't form a complete sentence, but it's used to:

- chain actions (do X and Y)
- form requests (please do X)
- ask for permission, express prohibitions
- describe ongoing actions (〜ている)
- connect actions causally (do X and as a result Y)

You **must** memorize the te-form rules — they recur constantly.

## Formation rules

### Ru-verbs

Drop る, add て:
- 食べ**る** → 食べ**て**
- 見**る** → 見**て**
- 起き**る** → 起き**て**

### U-verbs — by ending

The rule changes based on the final syllable of the dictionary form:

| Ending | Change | Example |
|---|---|---|
| う / つ / る | → って | 買う → 買って, 待つ → 待って, ある → あって |
| む / ぶ / ぬ | → んで | 読む → 読んで, 飛ぶ → 飛んで, 死ぬ → 死んで |
| く | → いて | 書く → 書いて |
| ぐ | → いで | 泳ぐ → 泳いで |
| す | → して | 話す → 話して |

### Exception: 行く

**行く is exceptional**: it doesn't follow the く → いて rule.
- 行く → **行って** (NOT 行いて ✗)

### Irregular verbs

- する → **して**
- 来る → **きて**

## Why memorize this

The te-form is the input for at least 10 other grammar patterns: 〜てください, 〜ている, 〜てから, 〜ても, 〜てもいい, 〜てはいけない, 〜てしまう, 〜てあげる/くれる/もらう, 〜てみる, 〜ておく.

If you can't make te-forms instantly, every future grammar lesson will be slower. **Drill these until they're automatic.**

## Mnemonic for u-verbs

"miBUNu → nde, ucu/uTSU/uRU → tte, KU → ite (except 行く!), GU → ide, SU → shite"

## Common mistakes

- 行く → 行いて ✗ (should be 行って).
- 来る → くて ✗ (should be **きて**).
- Confusing 帰る (u-verb, 帰って) with ru-verb pattern.
- For すぐる, the て-form of する → ✓ **して** (not するて).
`,

  "genki-l6-2-te-uses": `
## What it is

Three of the most useful patterns built on the te-form:

1. **〜てください** — polite request
2. **〜てもいいですか** — asking permission
3. **〜てはいけません** — prohibition

## 〜てください — please do X

Polite request. Add ください to the te-form:

- 待っ**てください** (Please wait.)
- 読ん**でください** (Please read.)
- 来**てください** (Please come.)

Slightly softer: **〜てくださいませんか** (Could you please...?), or just add ね or よ for friendlier tone.

## 〜てもいい(ですか) — May I do X?

Te-form + も + いい. Used to ask permission or grant it:

- 写真を撮**ってもいいですか** (May I take a photo?)
- 食べ**てもいいです** (You may eat.)

The も here means *even if*; it's literally "is it good even if I X?".

To grant or refuse permission politely:
- いいですよ. (Sure.) / どうぞ. (Please go ahead.)
- ちょっと… / 困ります. (That's a bit difficult / I'd rather not.)

## 〜てはいけません — must not do X

Te-form + は + いけません. Strong prohibition, often used by authority figures (teachers, rules, parents):

- ここで食べ**てはいけません** (You must not eat here.)
- たばこを吸**ってはいけません** (No smoking.)

Casual contraction: 〜ちゃいけない / 〜じゃいけない.
- 食べちゃいけない (You can't eat that.)

Softer alternatives: 〜ないでください (please don't).

## Comparison

| Pattern | Strength | Context |
|---|---|---|
| 〜てください | neutral polite request | everyday |
| 〜てもいいです(か) | permission | asking / granting |
| 〜てはいけません | strict prohibition | rules, authority |
| 〜ないでください | gentle "please don't" | personal request |

## Common mistakes

- Forgetting the te-form: ✗ 待つください → ✓ 待っ**て**ください.
- Using てはいけません to refuse a casual request — too harsh. Use ちょっと… or 〜ないほうがいい.
- Replying to a permission question with です — answer with いいですよ or just いいです.
`,

  "genki-l7-1-teiru": `
## What it is

**te-form + いる** is a double-duty grammatical construction. Same form, two distinct meanings:

1. **Progressive** — currently doing X (action in progress).
2. **Resulting state** — the state that results from a past action.

Which meaning applies depends on the **type of verb** used.

## Progressive use

For action verbs (eat, read, walk, watch), 〜ている = English "be doing":

- 今、本を読ん**でいます** (I'm reading a book now.)
- テレビを見**ている** (I'm watching TV.)
- 食べ**ています** (I'm eating.)

Like English progressive: an action that started and hasn't finished.

## Resulting-state use

For **verbs of change** (marry, know, live, die, wear, open), 〜ている = the *state that resulted from* the action.

- 結婚し**ています** (I'm married.) — NOT "I'm currently marrying"
- 田中さんを知っ**ています** (I know Tanaka.) — past action of "becoming aware", current state of knowing
- 東京に住ん**でいます** (I live in Tokyo.) — moved there and now reside
- 死ん**でいる** (be dead) — NOT "is currently dying"

In English we'd just use the simple present (I'm married, I live in Tokyo), but Japanese requires ている to express the continuing state.

## How to tell which type

Action verbs whose effect is "complete in an instant" — 結婚する, 死ぬ, 知る, 住む, つく, 着る, 持つ — express **state** with 〜ている.

Action verbs that have **duration** — 食べる, 飲む, 読む, 見る — express **ongoing action** with 〜ている.

## Negative form

- 結婚し**ていません** = I'm not married.
- 食べ**ていません** = I'm not eating (right now).

Important exception: **知る** uses 知りません (not 知っていません) for negative — *I don't know*.

## Casual contractions

In casual speech, ている often becomes てる:
- 食べてる (I'm eating)
- 知ってる (I know)
- 結婚してる (I'm married)

Polite: ています. Casual: てる. Just drop the い.

## Common mistakes

- 知りますか for "do you know" → ✗. Use 知っ**ています**か.
- 結婚しました for "I am married" → ✗ (means "I got married", a one-time event). Use 結婚しています for the current state.
- Forgetting that some "state" verbs need ている for present meaning.
`,

  "genki-l7-2-te-sequence": `
## What it is

Using the te-form to chain multiple actions into one sentence. Equivalent to English *do X and Y* or *do X, then Y*.

## Pattern

\`\`\`
[Verb 1 in te-form], [Verb 2 in te-form], … [Final verb in any tense].
\`\`\`

- 朝起き**て**、コーヒーを飲ん**で**、学校に行きます.
  (I wake up, drink coffee, and go to school.)

The tense of the *whole* sentence is set by the **final verb only**. Earlier te-forms inherit that tense:
- 起きて、飲んで、行きました (I woke up, drank coffee, and went — all past).
- 起きて、飲んで、行きます (I wake up, drink coffee, and go — all present/habitual).

## Causal nuance

te-form chains often imply a *light* causal connection, similar to English "and" with implied "so":

- 寒く**て**、コートを着ました (It was cold, so I put on a coat.)
- 道が分からなく**て**、遅れました (I didn't know the way, so I was late.)

This is softer than から (because) — it just *links* the events.

## With adjectives

You can te-link adjectives too:
- い-adj: drop い + くて. 大きい → 大きくて (big and…)
- な-adj / noun + で. 静か → 静かで, 学生 → 学生で.

- この部屋は**大きくて**、明るい (This room is big and bright.)
- 田中さんは**学生で**、20歳です (Tanaka is a student and 20 years old.)

## Negative te-form

- ます-form: 食べないで or 食べなくて
- The difference: 食べないで focuses on the negative action that didn't take place; 食べなくて has a causal nuance.

## Common mistakes

- Using ます-form to chain: ✗ 起きます、飲みます、行きます. ✓ Use te-form for all but the last.
- Forgetting tense applies to the last verb only: don't conjugate every verb in past tense if you mean past. ✓ 起きて、飲んで、行き**ました** (past).
- Using て-form for opposing/contrastive actions: use が or けど instead.
`,

  "genki-l8-1-short-forms-present": `
## What it is

**Plain forms** (also called short forms, 普通形) are the dictionary/casual versions of verbs. Polite Japanese uses ます-forms; plain forms appear in:

- Casual conversation between friends or family
- Embedded clauses (before と思う, と言う, とき, etc.)
- Written narrative / books / newspapers
- Anime, manga, song lyrics

You must know both polite AND plain forms to function in Japanese.

## Plain present (dictionary form)

The verb's dictionary form **is** its plain present:
- 食べる (eat) / 飲む (drink) / する (do) / 来る (come)

## Plain present negative — by group

### Ru-verbs
Drop る + ない: 食べる → 食べ**ない**, 見る → 見**ない**.

### U-verbs
Change う-row to あ-row + ない:
- 飲**む** → 飲**まない**
- 書**く** → 書**かない**
- 話**す** → 話**さない**
- 待**つ** → 待**たない**
- 買**う** → 買**わない** (special: 〜う → 〜**わ**ない, NOT 〜あない)

### Exception: ある

ある → **ない** (NOT あらない). This is the same word as the い-adj ない.

### Irregular

- する → **しない**
- 来る → **こない** (NOT きない)

## Plain present of nouns / na-adjectives

- Positive: 学生**だ** (in casual speech, だ is often dropped before pauses or sentence-end: 学生)
- Negative: 学生**じゃない**

For な-adj:
- 静か**だ** / 静か**じゃない**
- きれい**だ** / きれい**じゃない**

## When to use plain forms

- **Talking to close friends, family, kids**: 食べる？ (Eating?)
- **Inside another sentence** (before と思う, とき, ので, から, etc.): 雨が降る**と思う** (I think it will rain).
- **In writing** (novels, articles, narration).

## When NOT

- Talking to strangers, customers, your boss, anyone older you don't know well — use ます-form.
- Mixing plain and polite in the same sentence is jarring.

## Common mistakes

- 買う → 買あない ✗ → ✓ 買**わ**ない.
- 来る → きない ✗ → ✓ **こ**ない.
- する → すない ✗ → ✓ **し**ない.
- Dropping だ in writing for nouns/na-adj — only drop in casual speech.
- Treating ある as a ru-verb: ✗ あれない → ✓ **ない**.
`,

  "genki-l8-2-to-omou": `
## What it is

Two patterns for reporting opinions or speech, both using **plain form + と**:

- **〜と思う** — *I think that...* (your own opinion)
- **〜と言っていた** — *(person) was saying...* (reported speech)

The と here is the "quote particle", marking the end of what was thought/said.

## Structure

\`\`\`
[Plain form (any tense)] + と思う／と言う
\`\`\`

The clause before と uses **plain form**:
- Verb: 行く, 行かない, 行った, 行かなかった
- い-adj: 高い, 高くない, 高かった, 高くなかった
- Noun/na-adj: 学生**だ**, 学生じゃない, 学生だった, 静か**だ** (note だ is required before と!)

## Examples

- 明日は雨**だと**思います. (I think it will rain tomorrow.)
- 彼は学生**だと**思う. (I think he's a student.)
- 彼女は来ない**と**言っていました. (She was saying she won't come.)
- これは難しい**と**思います. (I think this is difficult.)

## と言っていた vs と言った

- 〜と言っていた — *was saying* / *had said* (ongoing or recently mentioned)
- 〜と言った — *said* (one-time event)

For reporting what someone told you recently, use と言っていた — it's more natural.

## Important: noun/na-adj need だ before と

- ✓ 学生**だ**と思う
- ✗ 学生と思う (wrong — sounds like "I think [it is named] student")

For verbs and い-adjectives, no extra word — just plain form:
- ✓ 行く**と**思う
- ✓ 高い**と**思う

## Negative opinions

To say *I don't think...*, prefer **〜ないと思う** over **〜と思わない**:

- ✓ 来ない**と**思う (I think he won't come.)
- Less natural: 来る**と思わない**.

This is because Japanese tends to put the negation as close to the verb as possible.

## Casual quoting with って

In casual speech, **って** replaces と:
- 田中さんは来ない**って**言ってた (Tanaka said he's not coming. — casual)

## Common mistakes

- Forgetting だ before と: ✗ 学生と思う → ✓ 学生**だ**と思う.
- Using polite form before と: ✗ 行きますと思う → ✓ 行く**と**思う.
- Saying と思わない instead of ない+と思う for negative thoughts.
`,

  "genki-l9-1-short-past": `
## What it is

The **plain past form** (also called **た-form**) — the dictionary/casual past tense of verbs.

## Formation: it's the te-form with た

Take the te-form and **replace て with た**, で with だ. That's it.

| Verb | te-form | ta-form (plain past) |
|---|---|---|
| 食べる (ru) | 食べて | 食べ**た** |
| 読む (u, mu→nde) | 読んで | 読ん**だ** |
| 書く (u, ku→ite) | 書いて | 書い**た** |
| 行く (irregular u) | 行って | 行っ**た** |
| する | して | し**た** |
| 来る | きて | **き**た |

Same rules as te-form. If you know te-form, you know ta-form.

## Plain past negative

Take the plain negative (〜ない) and conjugate ない as an い-adjective:
- ない → なかった
- 食べない → 食べ**なかった**
- 読まない → 読ま**なかった**
- 行かない → 行か**なかった**
- しない → し**なかった**
- こない → こ**なかった**

## Nouns / na-adjectives

| Form | Plain | Polite |
|---|---|---|
| Positive past | 学生**だった** | 学生でした |
| Negative past | 学生**じゃなかった** | 学生じゃなかったです |

Same for な-adj: 静か**だった** / 静か**じゃなかった**.

## When to use

- Casual conversation: 昨日テレビを見**た** (I watched TV yesterday.)
- Embedded clauses (before と思う, とき, ので, etc.): 食べた**と思う** (I think I ate it.)
- Narration / written narrative

## Common mistakes

- ある → ✗ あらなかった → ✓ **なかった** (same as ない's past).
- する → ✗ するた → ✓ し**た**.
- 来る → ✗ くた → ✓ **き**た.
- Forgetting that だ replaces た after mu/bu/nu verbs: 読んだ ✓ NOT 読んた ✗.
- Mixing past plain forms with です: ✗ 行ったです → ✓ 行きました OR 行った.
`,

  "genki-l9-2-tari": `
## What it is

**〜たり〜たりする** lists a *few example activities* among others. The English nuance is *"do things like X and Y"* — implying you do more besides those, you just listed a couple.

## Pattern

\`\`\`
Plain past + り、Plain past + り + する
\`\`\`

- 週末は本を読ん**だり**、映画を見**たり**します.
  (On weekends I do things like read books and watch movies.)

## Key points

1. Use the **plain past form** (た-form) + り. Same conjugation: 食べたり, 飲んだり, 行ったり, したり, きたり.
2. End the whole pattern with **する** in the appropriate tense.
3. Usually you list **two** activities, but you can list more or even just one (rare).

## Implied "and other things"

Unlike a simple て-form chain (which implies you did exactly those things in order), たり-list is **non-exhaustive** — you did these *among other things*, in no particular order.

## Tense flexibility

The final する determines tense for everything:
- します — habitually do
- しました — did (in the past)
- したいです — want to do

- 食べたり、飲んだり**しました** (We ate and drank, etc.)
- 食べたり、飲んだり**したい** (I want to eat, drink, etc.)

## Single たり

Sometimes used with just one item, emphasizing variability:
- 朝起きるのが早かったり遅かったりする (My morning wake-ups are sometimes early, sometimes late.)

## With nouns / na-adjectives

Use 〜だったり〜だったり:
- 雨だったり、雪だったりします. (Sometimes it rains, sometimes it snows.)

## Common mistakes

- Using dictionary form: ✗ 読むたり → ✓ 読ん**だ**たり (wait, it's 読んだり — just だ + り).
- Forgetting する at the end: ✗ 読んだり、見たり → ✓ 読んだり、見たり**します**.
- Using て-form: ✗ 読んでり → ✓ 読んだり.
- Treating it as a strict list (must include all): no — たり implies these are just samples.
`,

  "genki-l10-1-comparisons": `
## What it is

The Japanese system for comparing two things. There's no -er ending like English; instead you use particles and word order.

## Pattern 1: "B is more X than A"

\`\`\`
AよりBのほうが [adjective] です
\`\`\`

- 犬**より**猫**のほうが**好きです. (I like cats more than dogs.)
- コーヒー**より**紅茶**のほうが**おいしいです. (Tea is tastier than coffee.)

Translates literally to "Compared to A, B's side is X" — but English uses "B is more X than A".

## Pattern 2: "Which is more X?"

\`\`\`
A と B、どちら／どっち が [adjective] ですか
\`\`\`

- 東京と大阪、**どちらが**大きいですか. (Which is bigger, Tokyo or Osaka?)
- 寿司とラーメン、**どっちが**好き? (Which do you like more, sushi or ramen? — casual)

**Note**: どこ (where) is for places, but for *which-of-two*, use どちら / どっち.

## Pattern 3: "About the same"

\`\`\`
A は B と同じぐらい X です
\`\`\`

- 東京は大阪と同じぐらい大きいです. (Tokyo is about as big as Osaka.)

## Answering a comparison question

Always include の to confirm which one:
- Q: 犬と猫、どちらが好きですか?
- A: 猫**のほうが**好きです. (I prefer cats.)

You can also say 猫が好きです, but のほうが makes the comparison explicit.

## "Most" — superlatives

For more than two items, use **一番** (most / number-one):
- 一番好きな食べ物は寿司です. (My most favorite food is sushi.)

Or で の中で (among):
- 日本の中で東京が一番大きいです. (Among Japan, Tokyo is the biggest.)

## Common mistakes

- Forgetting の in のほうが: ✗ Bほうが → ✓ B**の**ほうが.
- Using どこ for "which of two": ✗ 東京と大阪、どこが…? → ✓ どちら/どっち.
- Reversing the order: ✗ "Bより A のほうが" means B is the one being compared, not A. Be careful.
`,

  "genki-l10-2-tara": `
## What it is

The **〜たら** conditional. Versatile — covers if, when, and once.

## Formation

**Plain past form (た-form) + ら**:
- 行く → 行ったら
- 食べる → 食べたら
- する → したら
- 来る → きたら
- ある → あったら
- いい → よかったら (uses よ-stem!)

For nouns/na-adj: noun + **だったら**: 学生だったら, 静かだったら.

For い-adj: drop い + **かったら**: 安**かったら** (if cheap).

## Two main meanings

### 1. Conditional "if"

"If X happens, then Y":
- 雨が降ったら、行きません. (If it rains, I won't go.)
- 安かったら買います. (If it's cheap, I'll buy it.)
- お金があったら、旅行したい. (If I had money, I'd want to travel.)

### 2. Temporal "when / once"

"When/once X happens, Y":
- うちに帰ったら、電話します. (When I get home, I'll call.)
- 食べたら、出かけよう. (Once we eat, let's go out.)

### 3. Past discovery

When the verb before たら is past and the main clause is past, it means *when I did X, I found Y*:
- 家に着いたら、誰もいなかった. (When I got home, no one was there. — discovered)

## 〜たら vs 〜ば vs 〜と

All three are conditionals, but:

| Form | Use |
|---|---|
| 〜たら | Most versatile — concrete/specific situations, future events, past discovery |
| 〜ば | Hypothetical, general rules, "if I were to..." |
| 〜と | Automatic consequences (if X then automatically Y) |

If unsure, **use たら**. It works in most everyday situations.

## Common mistakes

- いい → ✗ いかったら → ✓ **よ**かったら.
- ある → ✗ あったたら → ✓ あったら.
- Using past form in main clause when meaning is future: ✗ 帰ったら、電話しました.
  ✓ 帰ったら、電話します (will call when I get back).
`,

  "genki-l11-1-tai": `
## What it is

The **〜たい** suffix expresses *I want to do X*. It's only used for **your own desires** (or when asking about the listener's).

## Formation

Take the **verb stem** (the ます-form without ます) and add **たい**:
- 食べ**ます** → 食べ**たい** (want to eat)
- 飲み**ます** → 飲み**たい** (want to drink)
- 行き**ます** → 行き**たい** (want to go)
- し**ます** → し**たい** (want to do)
- き**ます** → き**たい** (want to come)

## Conjugates like an い-adjective

Once you have たい, treat it just like 大きい:

| | Form |
|---|---|
| Positive | 食べた**い**です |
| Negative | 食べた**くない**です |
| Past positive | 食べた**かった**です |
| Past negative | 食べた**くなかった**です |

## Object marker: が or を

Both are correct, with subtle difference:
- ✓ 寿司**が**食べたい (more traditional / focused on the desire object)
- ✓ 寿司**を**食べたい (also common in modern usage)

Both work; が is sometimes considered more elegant.

## Cannot be used for others

In Japanese, you can't directly state what someone else wants (it's considered rude to assume). Instead:

- For others' wants in casual speech, use **〜たがる** (changes たい → たがる; ru-verb conjugation): 田中さんは行き**たがっている** (Tanaka wants to go).
- Or report what they said: 田中さんは行きたい**と言っていた**.
- Or use the verb 〜たがる formally.

But for YES/NO questions, you can ask the listener directly: 食べたいですか? (Do you want to eat?)

## Common mistakes

- ✗ 食べるたい → ✓ 食べたい (use stem, not dictionary).
- ✗ 食べたい (about someone else, in plain assertion) → use 〜たがる or quote.
- Forgetting that たい conjugates like an い-adj: ✗ 食べたいじゃない → ✓ 食べた**くない**.
- Using polite ます before たい: ✗ 食べますたい → ✓ 食べたい.
`,

  "genki-l11-2-ta-koto-ga-aru": `
## What it is

**〜たことがある** = *have done X before / have the experience of X*. A way to talk about past experiences in general.

## Formation

\`\`\`
[Plain past form] + ことがある／ない／あります／ありません
\`\`\`

- 日本に行**ったことがあります** (I have been to Japan.)
- 寿司を食べ**たことがありますか** (Have you ever eaten sushi?)
- 馬に乗っ**たことがない** (I've never ridden a horse.)

## Literal breakdown

**こと** = thing/event. **がある** = exists. So 食べたことがある literally means *the event of having eaten exists*. The English equivalent is the present perfect: *have eaten*.

## Tense of こと clause

The verb must be in **past plain form** (た-form), even though the overall meaning is about a present-day experience:
- ✓ 行ったことがある
- ✗ 行くことがある (this means something different — "there are times when I go")

## 〜ことがある (dictionary form) — different meaning

Be careful: **dictionary form + ことがある** means *there are times when I do X / sometimes I do X*:
- 寿司を食べる**ことがある** (Sometimes I eat sushi.) — not "I have eaten sushi".

Only **た-form + ことがある** = "have ever done".

## Negative

- 行ったことが**ない** (never been)
- 行ったことが**ありません** (polite version)

## Asking

- 〜たことがありますか — Have you ever...?

Natural responses:
- はい、あります. (Yes, I have.)
- いいえ、(まだ) ありません. (No, I haven't [yet].)

## With time references

Usually used WITHOUT specific time references (it's about general experience):
- ✓ 寿司を食べたことがある
- For specific past events, just use the past form: 昨日寿司を食べた (I ate sushi yesterday.)

## Common mistakes

- Using dictionary form: ✗ 行くことがある (means "sometimes I go") → ✓ 行ったことがある (have been).
- Using ます-form: ✗ 行きましたことがある → ✓ 行った**ことがあります**.
- Adding specific time: ✗ 昨日行ったことがある — for a recent specific event, just say 昨日行った.
`,

  "genki-l12-1-n-desu": `
## What it is

**〜んです** (sometimes **〜のです** in writing, **〜の** casually) softens a sentence by giving or asking for an **explanation / context / reason**.

It's one of the most distinctively Japanese grammar patterns and very high-frequency in conversation.

## Pattern

\`\`\`
[Plain form] + んです
\`\`\`

For verbs and い-adj: dictionary form directly. For nouns and na-adj: **な** before んです.

| Type | Example |
|---|---|
| Verb (plain) | 食べる**んです** (You see, I eat / about to eat) |
| い-adj | 高い**んです** (It's expensive, you see) |
| Noun + な | 学生**なんです** (I'm a student, you see) |
| な-adj + な | 静か**なんです** (It's quiet, you see) |

Plain past works too: 食べた**んです** (I ate, in case that explains it).

## What it adds

The sentence-level meaning of んです is:
- "Here's the reason / explanation."
- "Let me explain why."
- Or when asking: "Could you tell me the reason?"

Compare:
- 頭が痛いです (I have a headache.) — bare statement
- 頭が痛い**んです** (I have a headache, you see / that's why...) — invites context

## Two-way use

### Giving explanation

- どうして来なかったんですか? — Why didn't you come?
- 頭が痛い**んです**. (Because I have a headache.)

### Asking for explanation

- どうして来なかった**んですか**? (Why didn't you come?)
- 何をしている**んですか**? (What are you doing? — implying you want context)

## When NOT to use んです

- For pure factual statements without context: ✗ 私は学生なんです — too explanatory for a first introduction.
- Just say 私は学生です.

## Casual contractions

- んです → ん (casual): 食べる**ん**? (Are you going to eat?)
- んです → の (feminine/soft casual): 食べる**の**? (Are you eating?)

## Common mistakes

- Forgetting な with nouns/na-adj: ✗ 学生**んです** → ✓ 学生**なんです**.
- Adding んです to everything — overuses the explanation nuance.
- Using ますんです: ✗ 食べますんです → ✓ 食べる**んです** (always plain form before ん).
`,

  "genki-l12-2-suggestions-obligations": `
## What it is

Three patterns covering advice, excess, and obligation — all extremely common in daily conversation.

## 1. 〜すぎる — too much

Attach **すぎる** to indicate excess:

- **Verbs**: drop ます → stem + すぎる. 食べ**すぎる** (eat too much).
- **い-adj**: drop い + すぎる. 高**すぎる** (too expensive).
- **な-adj / noun**: just add すぎる. 静か**すぎる** (too quiet).

すぎる itself is an ichidan verb, so conjugate it as one:
- 食べすぎ**ます** / 食べすぎ**た** / 食べすぎ**ない**.

## 2. 〜たほうがいい — you should do X

Pattern: **plain past + ほうがいい** = *you should do X / it'd be better to do X*.

- 薬を飲ん**だほうがいいです** (You should take medicine.)
- 早く寝**たほうがいい** (You should go to bed early.)

### Negative advice: 〜ないほうがいい

For "you shouldn't", use the **plain present negative + ほうがいい**:
- 食べな**いほうがいい** (You shouldn't eat that.)

## 3. 〜なくちゃいけません — must do X

Pattern: **negative stem + なくちゃいけません** = *must do X / have to do X*.

Take the plain negative ない-form, replace ない with **なくちゃ + いけません**:
- 食べない → 食べ**なくちゃいけません** (must eat)
- 行かない → 行か**なくちゃいけません** (must go)
- しない → し**なくちゃいけません** (must do)

### Variations

| Form | Style |
|---|---|
| 〜なくちゃいけない / なくちゃ | casual |
| 〜なきゃいけない / なきゃ | casual (slangier) |
| 〜なくてはいけません | polite, more formal |
| 〜なければなりません | formal, often written |

### Casual short forms

- 食べなきゃ (gotta eat — very casual, often complete sentence)
- 行かなくちゃ (gotta go — same)

## Common mistakes

- Adding い to い-adj before すぎる: ✗ 高い**すぎる** → ✓ 高**すぎる**.
- Forgetting past form before ほうがいい: ✗ 飲むほうがいい → ✓ 飲**んだ**ほうがいい (for affirmative).
- Forming the negative wrong: ✗ 食べるなくちゃ → ✓ 食べ**なくちゃ** (drop る, add ない-stem).
`,

  "genki-l13-1-potential": `
## What it is

The **potential form** = "can do X" / "be able to X". A major Japanese verb conjugation that turns regular verbs into ability-expressing ones.

## Formation

### Ru-verbs
Drop る + **られる**:
- 食べる → 食べ**られる** (can eat)
- 見る → 見**られる** (can see)

### U-verbs
Change う-row to **え-row + る**:
- 読**む** → 読**める** (can read)
- 書**く** → 書**ける** (can write)
- 話**す** → 話**せる** (can speak)
- 行**く** → 行**ける** (can go)

### Irregular

- する → **できる** (can do — a separate verb)
- 来る → **こられる** (can come)

## Object marker switches を → が

Once a verb becomes potential, the direct-object marker often switches from を to が:
- (Normal) 寿司**を**食べます (I eat sushi.)
- (Potential) 寿司**が**食べられます (I can eat sushi.)

Both 寿司**を**食べられる and 寿司**が**食べられる are heard, but **が** is more traditional and recommended.

## "ら-抜き言葉" (la-dropping)

In casual modern speech, the ら in られる for ru-verbs is often dropped:
- 食べ**れる** (instead of 食べられる)
- 見**れる** (instead of 見られる)

This is widely used in conversation but considered informal/incorrect in written or formal contexts.

## できる — a verb of its own

できる is the potential of する but conjugates as a regular ichidan verb:
- できます / できません / できた / できなかった
- 日本語が**できます** (I can speak/do Japanese.)

For activities introduced by する (e.g. 勉強する), you can either use prep + できる or shorten:
- 勉強できる ✓ (can study)
- 運動できる ✓ (can exercise)

## Negative / past forms

Conjugate as ichidan verbs:
- 食べられる → 食べられ**ない** (can't eat) → 食べられ**ました** (was able to eat) → 食べられ**ませんでした**.

## Common mistakes

- する → ✗ される (that's the passive) → ✓ **できる**.
- 来る → ✗ こられない... wait, ✓ こられない (it IS こられる/こられない).
- Forgetting to switch を→が: not strictly required but more natural with が.
- Using ます-form before potential: ✗ 食べますられる → ✓ **食べられる**.
`,

  "genki-l13-2-shi": `
## What it is

The particle **〜し** lists *multiple reasons or characteristics*, implying *and there are more besides these*. Often translated as *"... and ... (and other things)"*.

## Pattern

\`\`\`
[Plain form] + し、[plain form] + し、[conclusion or main clause]
\`\`\`

- この店は安**いし**、おいしい**し**、よく来ます. (This place is cheap and tasty, so I come often.)

## Forms before し

- Verbs / い-adj: **plain form** directly. 安い**し**, 食べる**し**.
- Nouns / na-adj: **だ + し**. 学生**だし**, 静か**だし**.
- Negatives, past tenses: still plain form. 来ない**し**, 食べた**し**.

## Nuance

し doesn't just list — it suggests *there are even more reasons or characteristics*. The listener knows you could go on.

Compare:
- 安いし、おいしい (cheap and tasty, and more reasons exist)
- 安くておいしい (cheap and tasty — just those two facts, more neutral)

## Often paired with a conclusion

You usually end with a conclusion drawn from the listed reasons:
- 安いし、おいしいし、(だから) よく来ます (Cheap, tasty, so I come often.)
- 親切だし、面白いし、人気があります (Kind, funny, so popular.)

## Single 〜し

Even a single し implies "and also other reasons":
- 今日は寒い**し**、行かない (It's cold today (among other reasons), so I'm not going.)

## Comparison with から / ので / て

| Conjunction | Nuance |
|---|---|
| から | direct reason — because X |
| ので | softer reason — since X |
| て (te-form) | adjacent description — and |
| し | one of many reasons — among other things |

## Common mistakes

- Forgetting **だ** with noun/na-adj: ✗ 学生し → ✓ 学生**だ**し.
- Using polite form: ✗ 安いですし → ✓ 安い**し** (always plain before し).
- Forgetting the conclusion — the listener expects you to wrap it up.
`,

  "genki-l14-1-te-hoshii": `
## What it is

**〜てほしい** = *want someone to do X*. Specifically about other people's actions, not your own.

## Pattern

\`\`\`
[Person] に [Verb te-form] + ほしい
\`\`\`

The agent (the person you want to do something) is marked with **に**.

- もっと話し**てほしい**です. (I want you to talk more.)
- 先生にこれを読ん**でほしい**. (I want my teacher to read this.)
- ここに来ない**でほしい**. (I want you NOT to come here.)

## Negative form (don't want them to)

**〜ないでほしい** — want them NOT to do X:
- 行かない**でほしい** (Want you not to go.)
- 言わない**でほしい** (Want you not to say.)

ほしい conjugates like an い-adjective:
- 食べてほしい**くない** (Don't want them to eat) — less common; usually use 〜ないでほしい instead.

## ほしい vs たい

- 〜たい — *I want to do X* (own desire)
- 〜てほしい — *I want SOMEONE ELSE to do X*

Don't confuse these.

## Polite version with もらえませんか

For a more polite "would you do X for me?", you can use the receiving pattern from L16:
- 手伝っ**てもらえませんか** (Could you help me?) — more polite request.

## Common mistakes

- Using を for the agent: ✗ 田中さん**を**話してほしい → ✓ 田中さん**に**話してほしい.
- Using 〜たい to express others' wants: ✗ 田中さんは行きたい (asserting Tanaka's wants directly) → ✓ 田中さんに行ってほしい (I want Tanaka to go).
- Forgetting て-form: ✗ 話すほしい → ✓ 話し**て**ほしい.
`,

  "genki-l14-2-node": `
## What it is

**〜ので** = *because, since*. Used to give reasons. Softer and more objective than から.

## Pattern

\`\`\`
[Plain form] + ので、[main clause]
\`\`\`

- Verb / い-adj: dictionary form + ので. 寒い**ので**, 行く**ので**.
- Noun / na-adj: **な + ので**. 学生**なので**, 静か**なので**.

## Examples

- 頭が痛い**ので**、帰ります. (Since I have a headache, I'll go home.)
- 学生**なので**、安くなります. (Since I'm a student, it's cheaper.)
- 雨が降っている**ので**、出かけません. (Since it's raining, I won't go out.)

## ので vs から

Both mean "because", but:

| | から | ので |
|---|---|---|
| Tone | direct, personal | soft, objective |
| Common in | conversation | polite / formal explanations |
| With request | works | preferred (sounds more polite) |
| Best for | strong personal reasons | objective circumstances |

For polite requests, ので feels more deferential:
- ちょっと忙しい**ので**、また後で. (I'm a bit busy, so [I'll be back] later.)

## Followed by です

You CAN say です before ので, but most natural is plain form + ので:
- ✓ 寒い**ので** (plain)
- ✓ 寒い**ですので** (very polite — adds extra deference, but slightly stiff)
- Most common: just plain form + ので, even in polite contexts.

## Cannot be used with strong commands

Don't use ので with imperatives or strong volition expressions:
- ✗ 寒いので、ドアを閉めろ! (too harsh — use から or just be direct)

## Common mistakes

- Forgetting な with noun/na-adj: ✗ 学生**ので** → ✓ 学生**なので**.
- Using polite form (sounds stiff): ✗ 寒い**ですので** in casual contexts.
- Treating ので as a complete sentence: ✗ 頭が痛いので. → ✓ Add main clause.
`,

  "genki-l15-1-volitional": `
## What it is

The **plain volitional form** = "let's do X" / "I shall X" (in your own mind, deciding to do something).

In polite speech, ましょう serves the same purpose (let's). Volitional is just the **plain/casual** equivalent.

## Formation

### Ru-verbs
Drop る + **よう**:
- 食べる → 食べ**よう**
- 寝る → 寝**よう**

### U-verbs
Change う-row to **お-row + う**:
- 行**く** → 行**こう**
- 飲**む** → 飲**もう**
- 話**す** → 話**そう**
- 待**つ** → 待**とう**
- 買**う** → 買**おう**

### Irregular

- する → **しよう**
- 来る → **こよう**

## Two main meanings

### 1. "Let's..." (suggestion to a group)

- そろそろ行**こう**. (Let's go soon.)
- 食べ**よう**! (Let's eat!)
- 一緒に勉強し**よう**. (Let's study together.)

### 2. "I shall..." (internal resolution)

- よし、頑張**ろう**! (Right, I'll do my best!)
- 今日は早く寝**よう**. (I'll go to bed early today.)

## Comparison with ましょう

| Form | Style |
|---|---|
| 食べましょう | polite "let's eat" |
| 食べよう | casual "let's eat" |
| Both | suggestion / resolution |

Use **ましょう** with strangers, teachers, customers. Use **よう/おう** with close friends, family, kids — or in your own thoughts.

## Building further patterns

Volitional + と思う = "I'm thinking of doing X" (Lesson 15.2):
- 行こう**と思う** (I'm thinking of going.)

Volitional + として = "in order to / as":
- 行こう**として**いる (about to go)

## Common mistakes

- 食べる → ✗ 食べおう → ✓ 食べ**よう** (ru-verbs use よう).
- 来る → ✗ きよう → ✓ **こ**よう.
- する → ✗ しおう → ✓ **しよう** (not shi-o-u).
- Using polite ます: ✗ 食べますう → ✓ 食べ**よう**.
`,

  "genki-l15-2-intentions": `
## What it is

Three patterns for expressing **intentions and plans**, ranging from "thinking about it" to "decided":

1. **〜ようと思う** — *I'm thinking of doing X*
2. **〜つもりです** — *I plan to do X*
3. **〜ことにする** — *I've decided to do X*

## 1. 〜ようと思う — "thinking of doing"

Volitional form + と思う:
- 京都に行**こうと思います**. (I'm thinking of going to Kyoto.)
- 新しい車を買**おうと思って**います. (I'm thinking of buying a new car. — soft/ongoing intention)

Negative: 〜ないようと思う doesn't exist; instead use the negative inside と思う: 行か**ない**と思います (I don't think I'll go).

## 2. 〜つもりです — "I plan to"

Dictionary form + **つもりです**. Stronger commitment than 〜ようと思う.

- 来年日本に行く**つもりです**. (I plan to go to Japan next year.)
- 大学院に進む**つもり**だ. (I plan to go to grad school.)

Negative: dictionary form + ないつもりです:
- 行か**ないつもり**です. (I plan not to go.)

## 3. 〜ことにする — "decided to"

Dictionary form + ことに + する/しました. Marks a fresh **decision**.

- 勉強する**ことに**しました. (I've decided to study.)
- 行か**ない**ことに**しました**. (I've decided not to go.)

Compare:
- つもり = ongoing plan
- ことにする = active decision moment

## 4. 〜ことになる — "it was decided" (passive)

Slightly different: ことになる is used when *circumstances* lead to a decision (often by others):
- 来週東京に行く**ことになりました**. (It's been decided that I'll go to Tokyo next week.)

This makes the decision feel external/imposed, useful for talking about company moves, scheduling.

## Comparison

| Pattern | Nuance |
|---|---|
| 〜ようと思う | vague intention, "thinking of" |
| 〜つもり | firm plan |
| 〜ことにする | decision just made |
| 〜ことになる | decision external / circumstances |

## Common mistakes

- Using volitional before つもり: ✗ 行こうつもり → ✓ 行く**つもり**.
- Using polite ます before these: ✗ 行きますつもり → ✓ 行く**つもり**.
- Saying ようと思います for "I will" — too vague. Use つもり for firm plans.
`,

  "genki-l16-1-giving-receiving": `
## What it is

The **giving-and-receiving system** in Japanese. Tracks not just *what* was done but *for whom*, expressing favor / kindness / debt direction.

Three patterns based on perspective:

| Pattern | Direction | Translation |
|---|---|---|
| 〜てあげる | I → you/others | I do X for them |
| 〜てくれる | They → me | They do X for me |
| 〜てもらう | I receive from them | I had/got them to do X |

## 〜てあげる — I do X for someone

- 友達に本を貸し**てあげました**. (I lent a book to my friend.)
- ケーキを作っ**てあげる**. (I'll make a cake for you.)

The receiver is marked with **に** or に + 対象を for the action object.

Polite/humble: 〜て差し上げる (very formal, almost too humble for everyday use).

## 〜てくれる — someone does X for me

- 先生が教え**てくれました**. (My teacher [kindly] taught me.)
- 友達がプレゼントを買っ**てくれた**. (My friend bought me a present.)

The giver is marked with **が**. This expresses gratitude — the action benefited you.

Polite: 〜てくださる (someone respected does it for me).

## 〜てもらう — I receive the action

- 兄に手伝っ**てもらいました**. (I had my brother help me. / My brother helped me.)
- 先生に説明し**てもらった**. (I had the teacher explain.)

The giver is marked with **に**. Subject is you (the receiver).

Polite: 〜ていただく (humble — *I received the action from someone respected*).

## くれる vs もらう

Both express receiving an action from someone, but:

- **〜てくれる**: They did it [for me]. Active focus on the giver's kindness.
- **〜てもらう**: I had them do it [I asked / received the action]. Focus on my receiving.

Compare:
- 先生が教えてくれた = The teacher [kindly] taught me.
- 先生に教えてもらった = I had the teacher teach me / received teaching from the teacher.

Both translate similarly, but the focus differs.

## Asking favors

Common polite request: **〜てもらえませんか / いただけませんか** = Could you do X for me?
- これを読んで**もらえませんか** (Could you read this for me?)
- ここに名前を書いて**いただけませんか** (Could you write your name here, please?)

## Common mistakes

- Using くれる when *you* do something for someone: ✗ 私が友達に本を貸してくれた → ✓ 貸してあげた.
- Using あげる when receiving: ✗ 先生が教えてあげた (says the teacher gave to themselves) → ✓ くれた / もらった.
- Forgetting markers: が for giver in くれる, に for receiver in あげる/もらう.
`,

  "genki-l16-2-ba": `
## What it is

The **ば-conditional**. One of three Japanese conditionals (along with たら and と). Used for **hypothetical / general** "if" statements.

## Formation

### Ru-verbs
Drop る + **れば**:
- 食べる → 食べ**れば**
- 見る → 見**れば**

### U-verbs
Change う-row to **え-row + ば**:
- 行**く** → 行**けば**
- 飲**む** → 飲**めば**
- 話**す** → 話**せば**
- 買**う** → 買**えば**

### Irregular

- する → **すれば**
- 来る → **くれば**

### い-adjectives

Drop い + **ければ**:
- 高い → 高**ければ**
- 安い → 安**ければ**

Exception: いい → **よければ**.

### Negative

Take the negative ない-form, drop い, add ければ:
- 食べない → 食べ**なければ**
- 行かない → 行か**なければ**
- しない → し**なければ**

## When to use ば vs たら vs と

| Conditional | Use |
|---|---|
| ば | general rules, hypothetical, "if X were/happened" |
| たら | specific situations, future events, past discovery |
| と | automatic / natural consequence ("if X then automatically Y") |

ば favors timeless or hypothetical:
- 安**ければ**買います. (If it's cheap, I'll buy it. — general)
- 雨が降**れば**、行きません. (If it rains, I won't go. — hypothetical)
- 勉強**すれば**、合格できる. (If you study, you can pass. — general rule)

## Restrictions

ば-clause **cannot** have specific future actions in the main clause if the subject is the same person. For everyday "if X then I'll Y" with specific actions, prefer たら:
- ✓ 帰ったら、電話します (when I get back, I'll call) — たら
- ✗ 帰れば、電話します (sounds odd / overly general)

ば works fine when the main clause is a general result, a stated preference, or about another agent:
- 安ければ買います ✓ (general rule)
- ✓ 私が頼**めば**、彼は手伝います (If I ask, he'll help.)

## さえ〜ば — "as long as"

- これ**さえあれば**、大丈夫. (As long as I have this, I'm fine.)

## Common mistakes

- 行く → ✗ 行きば → ✓ 行**けば**.
- する → ✗ しれば → ✓ **すれ**ば.
- いい → ✗ いければ → ✓ **よ**ければ.
- 食べる → ✗ 食べば → ✓ 食べ**れば** (ru-verb keeps re-).
- Forgetting that な-adj/nouns need **なら** in this slot (covered in N3+), not ば.
`,

  "genki-l17-1-sou": `
## What it is

The suffix **〜そう** has **two distinct grammars**, both meaning roughly "looks/seems like X" but with different formation and nuance:

1. **Hearsay 〜そう** — "I heard that..." (reporting what others said)
2. **Appearance 〜そう** — "looks like / about to..." (your own observation)

## Hearsay 〜そう — "I heard..."

Attach to **plain form** (any tense):
- 明日は雨が降る**そうです**. (I heard it will rain tomorrow.)
- 田中さんは結婚した**そうだ**. (I heard Tanaka got married.)

Forms:
- Verbs / い-adj: dictionary form + そう. 高い**そう**, 行く**そう**.
- Nouns / na-adj: **だ + そう**. 学生**だそう**, 静か**だそう**.

## Appearance 〜そう — "looks like / about to"

Attach to the **stem** (no る, no い):
- 雨が降り**そう** (Looks like it'll rain.)
- おいし**そう** (Looks delicious.)

Forms:
- Verb: drop ます → stem + そう. 降ります → 降り**そう**.
- い-adj: drop い + そう. おいしい → おいし**そう**.
- な-adj: just + そう. 元気**そう** (looks healthy).

### Exception for い-adj

- いい → **よさそう** (looks good)
- ない → **なさそう** (looks like there isn't / not really)

## Telling them apart

| Type | Attaches to | Translates as |
|---|---|---|
| Hearsay | plain form (full) | "I heard..." |
| Appearance | stem (incomplete) | "looks like..." |

Examples to compare:
- 高い**そうです** → "I heard it's expensive" (hearsay, full word stays)
- 高**そうです** → "Looks expensive" (appearance, drops い)

## Negative appearance

For "doesn't look like":
- 元気じゃな**さそう** (doesn't look healthy)
- おいしくな**さそう** (doesn't look tasty)

(Drop い from くない → なさそう.)

## Modifying a noun

Appearance そう can modify nouns with な (treats そう as na-adj):
- おいし**そうな**ケーキ (a delicious-looking cake)
- 楽し**そうな**人 (a happy-looking person)

## Common mistakes

- Using stem with hearsay: ✗ 降りそうです (when meaning *I heard*) → ✓ 降る**そう** (hearsay).
- Using full form for appearance: ✗ おいしいそう (means "I heard it's tasty") vs ✓ おいし**そう** (looks tasty).
- Forgetting だ for noun/na-adj hearsay: ✗ 学生そう → ✓ 学生**だそう**.
`,

  "genki-l17-2-tara-tte": `
## What it is

Two distinct grammar points combined in this lesson:

1. **〜たら (past discovery)** — the "when X happened, I found Y" use of たら.
2. **〜って** — casual quoting particle (replaces と).

## 〜たら for past discovery

When **both clauses are in past** (たら + past main clause), the meaning shifts from "if/when" to "**when I did X, I found/discovered Y**":

- 家に着い**たら**、誰も**いなかった**. (When I got home, no one was there.)
- ドアを開け**たら**、猫がいた. (When I opened the door, there was a cat.)
- 起き**たら**、雨が降っていた. (When I woke up, it was raining.)

This is the **discovery** use — you didn't know Y until X happened.

Contrast with the regular conditional (where the main verb is future or volitional):
- 雨が降っ**たら**、行きません. (If it rains [in the future], I won't go.) — conditional
- 雨が降っ**たら**、もう帰っていました. (When the rain came, I had already gone home.) — past discovery

## って — casual quote

In informal speech, **って** replaces **と**:

- 田中さんは来ない**って**言ってた. (Tanaka said he's not coming.) — casual
- おいしい**って**! (They say it's good!)
- これ何**って**いう? (What's this called?)

Forms it can replace と in:
- と思う → って思う
- と言う → って言う
- とは → っては (or just って)

Also used as a sentence-ending particle indicating reported information:
- 雨が降る**って** (Word is, it's going to rain.)
- 田中さんは元気だ**って** (They say Tanaka's doing well.)

## Comparison

| Pattern | Meaning |
|---|---|
| 〜たら (たら → future verb) | conditional "if/when" |
| 〜たら (たら → past verb) | discovery "when X, I found Y" |
| 〜って | casual "[so-and-so] says/said" |
| 〜と (formal) | formal "[so-and-so] says/said" |

## Common mistakes

- Using って in formal/business writing — sounds too casual.
- Using 〜たら with past main clause for conditional meaning — usually fine, but ば might fit better for hypothetical conditions.
- Confusing 〜って (quote) with the small つ in て (te-form).
`,

  "genki-l18-1-transitive-intransitive": `
## What it is

Many Japanese verbs come in **transitive/intransitive pairs**: two related verbs with similar shapes, where one takes a direct object and one doesn't.

| Transitive (が→を) | Intransitive (が only) | Meaning |
|---|---|---|
| 開ける (akeru) | 開く (aku) | open |
| 閉める (shimeru) | 閉まる (shimaru) | close |
| 始める (hajimeru) | 始まる (hajimaru) | start |
| つける (tsukeru) | つく (tsuku) | turn on / become attached |
| 消す (kesu) | 消える (kieru) | turn off / disappear |
| 出す (dasu) | 出る (deru) | take out / exit |
| 入れる (ireru) | 入る (hairu) | put in / enter |
| 落とす (otosu) | 落ちる (ochiru) | drop / fall |
| 上げる (ageru) | 上がる (agaru) | raise / rise |
| 下げる (sageru) | 下がる (sagaru) | lower / decrease |

## How the particles change

- **Transitive**: [person] が [object] を [verb]
  - 私が窓**を**開けた. (I opened the window.)
- **Intransitive**: [subject] が [verb]
  - 窓**が**開いた. (The window opened.)

Same situation, two perspectives.

## Patterns to identify pairs

Many pairs follow recognizable patterns:

- **〜める / 〜まる**: 集める ↔ 集まる, 止める ↔ 止まる
- **〜す / 〜る**: 出す ↔ 出る, 戻す ↔ 戻る
- **〜ける / 〜く**: つける ↔ つく, 開ける ↔ 開く

But there are exceptions — don't always trust the pattern.

## Why this matters

Choosing the wrong one changes the meaning entirely:
- ドア**を**閉めた (I closed the door — transitive) ✓
- ドア**が**閉まった (The door closed by itself — intransitive) ✓
- ドア**を**閉まった ✗ (grammatical error — intransitive doesn't take を)

## Use with 〜ている

Both forms can take 〜ている but with different meanings:
- 窓を開けている → I am opening the window (action in progress)
- 窓が開いている → The window is open (resulting state)

## Common mistakes

- Using transitive when you mean "X happened by itself": ✗ 窓を開きました → ✓ 窓**が**開きました.
- Using intransitive when you did the action: ✗ ドアが閉めました → ✓ ドアを閉めました.
- Memorizing only one half — learn the pair together.
`,

  "genki-l18-2-te-shimau": `
## What it is

**〜てしまう** = te-form + しまう. Carries two related meanings:

1. **Completion** — finish doing X / do X all the way.
2. **Regret / unintended** — ended up doing X (often something you shouldn't have).

## Pattern

\`\`\`
[te-form] + しまう
\`\`\`

しまう conjugates as a regular u-verb:
- しまいます / しまった / しまわない / しまった

## Completion use

Emphasizes finishing the action completely:
- 宿題を全部やっ**てしまいました**. (I finished all the homework.)
- 本を読ん**でしまった**. (I finished reading the book.)

Often parallels English "X up" / "X all":
- 食べ**てしまった** (ate it all up)
- 飲ん**でしまった** (drank it all)

## Regret / unintended use

Action that wasn't planned or has negative consequences:
- ケーキを全部食べ**てしまった**. (I ended up eating all the cake. — regret)
- 電車に乗り遅れ**てしまった**. (I missed the train.)
- 財布をなくし**てしまった**. (I lost my wallet.)

Context determines which meaning applies.

## Casual contractions

In casual speech, 〜てしまう contracts to **〜ちゃう**, and 〜でしまう to **〜じゃう**:

- 食べ**ちゃう** (eat it up / end up eating)
- 食べ**ちゃった** (ate it up / ended up eating)
- 読ん**じゃう** (finish reading / end up reading)
- 行っ**ちゃった** (went and did it)

These are extremely common in conversation.

## Combining nuances

In actual usage, the line between "completion" and "regret" is fuzzy:
- 全部食べちゃった = "I ate it all" can be neutral completion or a guilty regret. Tone and context decide.

## Common mistakes

- Forgetting te-form: ✗ 食べるしまった → ✓ 食べ**て**しまった.
- Using 〜じゃう for verbs that should be 〜ちゃう: based on which verb endings make て vs で. 飲んで → 飲ん**じゃう**. 食べて → 食べ**ちゃう**.
- Overusing in formal writing — 〜ちゃう/じゃう is very casual.
`,

  "genki-l19-1-sonkeigo": `
## What it is

**Sonkeigo (尊敬語)** — *honorific* language. Used to **elevate** the listener or the subject of the sentence. Standard in business, with customers, with teachers, anyone of higher status.

## Three ways to make verbs honorific

### 1. Special honorific verbs (memorize these)

Some verbs have completely separate honorific forms:

| Plain | Honorific |
|---|---|
| いる / 行く / 来る | いらっしゃる / おいでになる |
| 食べる / 飲む | 召し上がる |
| 言う | おっしゃる |
| する | なさる |
| 見る | ご覧になる |
| 寝る | お休みになる |
| くれる | くださる |
| 知っている | ご存じだ |

These are irregular and must be memorized — they're the most respectful versions.

### 2. お + verb stem + になる

For verbs without a special honorific form:
- **お + [verb stem] + になる**
- 帰る → お帰り**になる**
- 待つ → お待ち**になる**
- 話す → お話し**になる**

This pattern is regular and productive.

### 3. ~られる (using the passive form)

The passive form can be used as a light honorific:
- 先生が来**られた** (the teacher came — honorific)
- 田中さんが書**かれた** (Tanaka wrote — honorific)

This is the **least respectful** of the three options but works in casual business contexts.

## Politeness layering

Honorifics combine with ます-form for the full polite version:
- お話し**になります** (politely speaks — honorific + masu)
- 召し上がり**ました** (ate — honorific + masu)

## Adjectives & nouns get honorific too

- お + noun (お名前 your name, お時間 your time)
- ご + Sino-Japanese noun (ご家族 your family, ご注文 your order)

## When to use

- **Always**: business with clients, customers, your boss's boss
- **Often**: speaking to teachers, doctors, anyone clearly senior
- **Sometimes**: in formal letters

## When NOT

- Among friends and family (sounds sarcastic / stilted)
- About yourself! (Use *humble* language, kenjougo, for your own actions)

## Common mistakes

- Using honorifics about yourself: ✗ 私は召し上がります → ✓ 私はいただきます (kenjougo).
- Forgetting お/ご prefix in noun cases: ✗ 名前は? → ✓ お名前は?
- Saying 食べられる when you mean "can eat" but it sounds honorific in context — ambiguity. Use 食べることができる for clarity in formal speech.
`,

  "genki-l20-1-kenjougo": `
## What it is

**Kenjougo (謙譲語)** — *humble* language. Used to **lower yourself** when talking about your own actions in front of someone of higher status. The flip side of sonkeigo (honorific).

## Two ways to make verbs humble

### 1. Special humble verbs (memorize)

| Plain | Humble |
|---|---|
| いる / 行く / 来る | おる / 参る |
| 食べる / 飲む / もらう | いただく |
| 言う | 申す / 申し上げる |
| する | 致す (いたす) |
| 見る | 拝見する |
| 聞く / 訪ねる | 伺う (うかがう) |
| 知っている | 存じておる / 存じ上げる |
| あげる | 差し上げる |

### 2. お + verb stem + する

For verbs without a special humble form:
- **お + [verb stem] + する**
- 持つ → お持ち**する**
- 待つ → お待ち**する**
- 送る → お送り**する**

Polite version: お持ち**します**, お持ち**いたします** (extra humble).

## Examples

- 明日**参ります**. (I'll come tomorrow. — humble)
- お荷物を**お持ちします**. (I'll carry your luggage. — humble)
- メールを**拝見しました**. (I have read your email. — humble)
- 田中**と申します**. (I'm called Tanaka. — humble version of と言います)

## When to use

- Speaking to clients / customers about *your own* actions
- In formal letters about yourself
- Job interviews

## Pairs: sonkeigo + kenjougo

The polite system pairs them:
- 先生が**いらっしゃいました**. (The teacher came. — honorific)
- 私が**参りました**. (I came. — humble)

Both express politeness; choose based on whose action you're describing.

## Levels of humility

- お+stem+する: humble
- お+stem+いたす: extra humble (very formal)
- 申し上げる, 差し上げる: peak formal humble

## Common mistakes

- Using kenjougo about others' actions: ✗ 先生が参りました (says the teacher humbled themselves) → ✓ 先生がいらっしゃいました.
- Using stem+する for verbs that have a special humble form: ✗ お食べする → ✓ いただく.
- Mixing levels: don't combine 行きました and 参ります in the same sentence about the same person.
`,

  "genki-l21-1-passive": `
## What it is

The **passive form (受身, ukemi)**. Expresses *X was done [to me/something]*, often with a sense of being affected — sometimes negatively (the "suffering passive").

## Formation

### Ru-verbs
Drop る + **られる**:
- 食べる → 食べ**られる** (be eaten)
- 見る → 見**られる** (be seen)

### U-verbs
Change う-row to **あ-row + れる**:
- 読**む** → 読**まれる**
- 書**く** → 書**かれる**
- 話**す** → 話**される**
- 取**る** → 取**られる**

### Irregular

- する → **される**
- 来る → **こられる** (same as potential)

## Pattern

\`\`\`
[Subject] が [Agent] に [Passive verb]
\`\`\`

The doer of the action is marked with **に**:
- 先生に質問**された** (was asked a question by the teacher)
- 弟にケーキを食べ**られた** (had my cake eaten by my little brother)

## Two types of passive

### 1. Direct passive

X is acted upon. Equivalent to English passive:
- 田中さんは先生に**ほめられた**. (Tanaka was praised by the teacher.)

### 2. Suffering passive (迷惑の受身)

Even with intransitive verbs, you can use passive to express "I was inconvenienced by X happening":
- 雨に**降られて**、大変でした. (I got rained on — what a pain.)
- 子供に**泣かれて**、寝られなかった. (My kid cried [on me] and I couldn't sleep.)

This is uniquely Japanese — there's no direct English equivalent. It expresses that the speaker was negatively affected.

## Note: same form as potential for ru-verbs

For ru-verbs, the passive form is identical to the potential form (食べられる). Context disambiguates:
- 寿司**が**食べられる (Sushi is eatable / I can eat sushi) — potential
- 寿司**を**弟に食べられた (Sushi was eaten by my brother) — passive

For u-verbs they're distinct:
- 読**める** (can read — potential)
- 読**まれる** (is read — passive)

## When to use

- Reporting what was done to you: business news, neutral descriptions, formal narration.
- Expressing distress / inconvenience caused by someone's action (suffering passive).
- Being polite (passive is used as light honorific — see L19).

## Common mistakes

- する → ✗ しれる → ✓ **される**.
- 行く → ✗ 行られる → ✓ 行**かれる** (suffering: I had someone go on me).
- Forgetting に for the agent: ✗ 先生質問された → ✓ 先生**に**質問された.
- Mistaking ru-verb passive for potential: in context, they're the same form.
`,

  "genki-l22-1-causative": `
## What it is

The **causative form (使役, shieki)**. Expresses *make/let someone do X*. Used to talk about commanding, allowing, or causing someone to perform an action.

## Formation

### Ru-verbs
Drop る + **させる**:
- 食べる → 食べ**させる**
- 見る → 見**させる**

### U-verbs
Change う-row to **あ-row + せる**:
- 読**む** → 読**ませる**
- 書**く** → 書**かせる**
- 話**す** → 話**させる** (yes, す → さ + せる)
- 行**く** → 行**かせる**

### Irregular

- する → **させる**
- 来る → **こさせる**

## Pattern

\`\`\`
[Causer] が [Person caused] を／に [Object] を [Causative verb]
\`\`\`

Conjugates as ichidan verb: させます / させない / させた / させなかった.

## を vs に for the agent

This is the trickiest part:

### Force (against will) → を

- 子供**を**寝**させる** (I made the child sleep.) — force, no choice
- 学生**を**勉強**させる** (force students to study)

### Permission (let do) → に

- 子供**に**ケーキを食べ**させる** (I let the child eat cake.) — permission
- 子供**に**遊ばせる (let the child play)

### Rule of thumb

- If the verb has no object: use **を** for "make" or **に** for "let".
- If the verb has an object (already takes を), the agent uses **に** to avoid double-を:
  - 学生に作文**を**書か**せる** ✓ (NOT 学生を作文を書かせる ✗)

## Examples

- 先生は学生に作文を書か**せました**. (The teacher made the students write an essay.)
- 母は弟を学校に行か**せました**. (Mom made my brother go to school.)
- 私はペットに自由に遊ば**せます**. (I let my pet play freely.)

## Causative + てください = polite "let me"

- (私を) 行か**せてください**. (Please let me go.)
- 紹介**させてください**. (Please let me introduce myself.)

A common polite formula for asking permission.

## Common mistakes

- ✗ する → しさせる → ✓ **させる** (just させる, not しさせる).
- ✗ 来る → きさせる → ✓ **こ**させる.
- Forgetting the を/に distinction: ✗ 子供を本を読ませた → ✓ 子供**に**本**を**読ませた.
- Using ます-form: ✗ 食べますせる → ✓ 食べ**させる**.
`,

  "genki-l23-1-causative-passive": `
## What it is

The **causative-passive** combines causative + passive: *I was made to do X (against my will)*. Expresses being forced to do something — often with a strong "I didn't want to" nuance.

## Formation

Start from the causative, then add the passive:

### Ru-verbs

Drop る + **させられる**:
- 食べる → 食べ**させられる**
- 見る → 見**させられる**

### U-verbs

There are two ways. **Both are correct**, but the contracted form is more common in speech for verbs ending in む/ぶ/ぐ/く/つ/う.

#### Full form (always works)
Change う-row to **あ-row + せられる**:
- 読**む** → 読**ませられる**
- 書**く** → 書**かせられる**
- 待**つ** → 待**たせられる**

#### Contracted form (more common in speech, except for ~す verbs)
Change う-row to **あ-row + される**:
- 読**む** → 読**まされる**
- 書**く** → 書**かされる**
- 待**つ** → 待**たされる**

**Exception**: verbs ending in **す** cannot use the short form (it would create double さ): 話**す** → 話**させられる** ONLY (not 話さされる).

### Irregular

- する → **させられる**
- 来る → **こさせられる**

## Pattern

\`\`\`
[Person made to do X] が [Person who made them] に [Verb causative-passive]
\`\`\`

The maker (boss/parent/teacher) is marked with **に**.

## Examples

- 親**に**勉強**させられました**. (I was made to study by my parents.)
- 毎日漢字を書**かされる**. (I'm made to write kanji every day.)
- 先生**に**長い作文を書**かせられました**. (The teacher made me write a long essay.)
- 子供のとき、嫌いな野菜を食べ**させられた**. (As a kid, I was made to eat veggies I didn't like.)

## Nuance: "ugh, I had to"

Causative-passive almost always carries reluctance / complaint:
- 毎日残業させられている. (I'm forced to work overtime every day.)
- 彼に1時間も待たされた. (He made me wait a whole hour.)

If you simply mean "I did X" without complaint, just use the regular form.

## Comparison with related forms

| Form | Meaning |
|---|---|
| 食べる | I eat |
| 食べさせる | I make someone eat |
| 食べられる | I'm eaten / I can eat |
| 食べさせられる | I'm made to eat (suffering) |

## Common mistakes

- ✗ 食べさせれる → ✓ 食べ**させ**られる (two ら needed for ru-verbs).
- Using short form with す-verbs: ✗ 話さされる → ✓ 話**させられる**.
- Reading nuance as neutral — it implies reluctance.
- Confusing with regular passive: 食べられる (was eaten / can eat) ≠ 食べさせられる (was forced to eat).
`,

  "genki-l23-2-you-ni": `
## What it is

A family of patterns built on **〜ように** that express **purpose, habit, and change**:

1. **〜ように** — *so that / in order to*
2. **〜ようにする** — *try to / make a habit of*
3. **〜ようになる** — *come to / start being able to*

## 1. 〜ように — "so that"

Pattern: **[Plain form] + ように, [main clause]**.

Used to state the **purpose** behind an action — almost always with verbs that can't be controlled (potential, intransitive, negative).

- 聞こえる**ように**、大きい声で話してください.
  (Please speak loudly **so that we can hear**.)
- 忘れない**ように**、メモを取ります.
  (I take notes **so I don't forget**.)
- 風邪を引かない**ように**、暖かくしてください.
  (Please stay warm **so you don't catch a cold**.)

The verb before ように is typically:
- A potential form (聞こえる, 見える, できる)
- A negative (忘れない, 風邪を引かない)
- An intransitive verb (動く, 開く)

If the action is volitional/controllable, use **ために** instead.

## 2. 〜ようにする — "try to / make a habit of"

Pattern: **[Dictionary or ない form] + ようにする**.

Expresses an effort to do or avoid doing something habitually.

- 野菜を食べる**ようにしています**. (I make a point of eating vegetables.)
- 甘い物を食べない**ようにしている**. (I'm trying not to eat sweets.)
- 早く寝る**ようにする**. (I'll try to go to bed early.)

## 3. 〜ようになる — "come to / become able to"

Pattern: **[Dictionary form / Potential form] + ようになる**.

Marks a **change of state** — you couldn't do X before, but now you can; or you didn't do X before, but now you do.

- 漢字が読める**ようになりました**. (I came to be able to read kanji.)
- 寿司が食べられる**ようになった**. (I came to be able to eat sushi.)
- 毎日運動する**ようになりました**. (I started exercising every day.)

For negative (no longer doing X), use **〜なくなる**:
- たばこを吸わ**なくなった**. (I stopped smoking.)

## Comparison

| Pattern | Meaning |
|---|---|
| 〜ように | so that... (purpose) |
| 〜ようにする | try to / habit |
| 〜ようになる | came to... (change) |
| 〜ために | in order to (with volitional verbs) |

## Common mistakes

- Using ように with volitional verbs in the "purpose" sense → ✗ 行くように言いました should be ために or as an indirect command.
- Confusing 〜ようにする (effort to do) with 〜ようになる (change in state): the first is active habit, the second is descriptive.
- Forgetting the dictionary form before ようになる: ✗ 読めますようになる → ✓ 読める**ように**なる.
`,
};

async function main() {
  console.log("Applying expanded grammar explanations…");
  let n = 0;
  for (const [slug, explanation] of Object.entries(EXPL)) {
    const found = await db.grammarPoint.findUnique({ where: { slug } });
    if (!found) {
      console.warn(`  ! Slug not found: ${slug}`);
      continue;
    }
    await db.grammarPoint.update({
      where: { slug },
      data: { explanation: explanation.trim() },
    });
    n++;
  }
  console.log(`  ✓ ${n} explanations updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
