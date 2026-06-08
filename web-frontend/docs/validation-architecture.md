# バリデーション設計: ドメイン集約・UI非依存

## 背景と目的

検証ルールはドメイン層の値オブジェクト（`TodoTitle` / `TodoId`）に集約しつつ、
**ドメイン層は UI 事情（React・入力欄名・表示文言・i18n）を一切知らない**状態を保つ。
その上で React のフォームが同じルールを再利用し、リアルタイム検証できるようにする。

### 解決した課題

- 以前のドメインは「例外を投げる」`of()` しか持たず、UI が送信前にルールを再利用できなかった。
- `TodoForm` は `title.trim() === ''` という独自の貧弱チェックしか持たなかった（ルール二重化の温床）。
- `useTodos` が送信後に投げられた `Error.message`（例: `'TodoTitle must not be empty'`）を
  そのまま画面バナーへ出しており、ドメインの文言が UI に漏れていた。

## 中核となる考え方

ドメインに**「投げない検証API」`validate()`** を追加し、結果を
**安定したエラーコードの判別共用体**（表示文言ではない）で返す。

```
ドメイン: validate(raw) -> { valid, issues: [{ code, params }] }
          ルールはここ一箇所。of() もこの validate() を呼んで例外を投げる
プレゼン: code -> 表示文言 に変換し、どの入力欄をどう見せるか決める
```

- ドメインは「タイトルが空」「長すぎる」を **コード**（`'EMPTY'` / `'TOO_LONG'`）として表現するだけ。
- 文言・i18n・どの欄を赤くするかは**すべてプレゼン層が所有**する。

## レイヤー構成と依存方向

```
domain/shared  ←  domain/todo  ←  presentation/validation  ←  presentation/hooks  ←  presentation/components
```

依存は一方向。ドメインは React を import せず、入力欄名も表示文言も持たない。
UI がドメインから受け取るのは次の3つだけ:

- 純粋関数 `validate()`
- 定数 `TodoTitle.MAX_LENGTH`（UI のカウンタ／`maxLength` 属性の単一情報源）
- 型 `*ErrorCode`（網羅 switch による文言漏れ防止に使う）

## 構成要素

| レイヤー | ファイル | 役割 |
|---|---|---|
| domain/shared | `src/domain/shared/ValidationResult.ts` | コード＋パラメータのみの再利用可能な判別共用体。文字列は持たない |
| domain | `src/domain/todo/value-objects/TodoTitle.ts` | `validate()` と `MAX_LENGTH`・`TodoTitleErrorCode` を公開。`of()` は `validate()` 経由 |
| domain | `src/domain/todo/value-objects/TodoId.ts` | 同パターン（`TodoIdErrorCode = 'NOT_INTEGER' \| 'NOT_POSITIVE'`） |
| presentation | `src/presentation/validation/todoTitleMessages.ts` | コード→メッセージ変換。文言／i18n の唯一の継ぎ目 |
| presentation | `src/presentation/hooks/useTodoTitleValidation.ts` | ドメイン `validate()` をフォームへ橋渡しするフック |
| presentation | `src/presentation/components/TodoForm.tsx` | リアルタイム＋送信時のインラインエラー、文字カウンタ、aria 配線 |

### 共有結果型 `ValidationResult<Code>`

```ts
export type ValidationIssue<Code extends string = string> = {
  readonly code: Code
  readonly params?: Readonly<Record<string, string | number>>
}

export type ValidationResult<Code extends string = string> =
  | { readonly valid: true; readonly issues: readonly [] }
  | { readonly valid: false; readonly issues: readonly ValidationIssue<Code>[] }
```

`Code` をジェネリックにし、各値オブジェクトが自分のリテラル共用体（例: `'EMPTY' | 'TOO_LONG'`）に絞る。
これにより UI 側は `code` を**網羅 switch** でき、ドメインにコードを追加すると変換側がコンパイルエラーになる。

### ドメイン値オブジェクト（`of()` と `validate()` の関係）

```ts
export type TodoTitleErrorCode = 'EMPTY' | 'TOO_LONG'

export const TodoTitle = {
  MAX_LENGTH: 255, // ルールと UI カウンタの単一情報源

  // 投げない・リアルタイム可。UI が送信前に呼べる。
  validate(value: string): ValidationResult<TodoTitleErrorCode> { /* ... */ },

  // 境界の強制点。validate() を使って従来通り例外を投げる（不変条件の番人）。
  of(value: string): TodoTitle {
    const result = TodoTitle.validate(value)
    if (!result.valid) throw new Error(`Invalid TodoTitle: ${result.issues[0].code}`)
    return value.trim() as TodoTitle
  },
}
```

- ルールは `validate()` 一箇所にのみ存在し、`of()` はそれに委譲する。
- `of()` はアプリケーション層（`CreateTodoUseCase` 等）の境界で不変条件を強制し続ける。
- 例外文言はコードベース（`Invalid TodoTitle: EMPTY`）になり、UI への文言漏れが起きない。

### プレゼン層: コード→メッセージ変換

```ts
export function formatTodoTitleIssue(issue: ValidationIssue<TodoTitleErrorCode>): string {
  switch (issue.code) {
    case 'EMPTY':    return 'Title is required.'
    case 'TOO_LONG': return `Title must be ${issue.params?.maxLength ?? ''} characters or fewer.`
  }
}
```

ここが文言・i18n の唯一の継ぎ目。将来 i18n を導入する場合もこの関数を `t()` 参照へ差し替えるだけでよい。

### フォームの挙動

- `touched`（入力 or 送信で true）後に `!isValid` ならインラインエラーを表示（`role="alert"`, `aria-describedby`）。
- リアルタイム（入力後 onChange）＋送信時の両方でエラーを表示。
- 送信ボタンは `submitting || !isValid` で無効化。
- `maxLength` と `{title.length}/{maxLength}` カウンタはドメインの `MAX_LENGTH` から取得（数値の二重定義なし）。

## 新しい値オブジェクトへの適用手順

1. エラーコードのリテラル共用体を定義（例: `type FooErrorCode = 'A' | 'B'`）。
2. `validate(raw): ValidationResult<FooErrorCode>` を実装し、`of()` をそれ経由で再実装。
3. UI に出すなら `presentation/validation/fooMessages.ts` に網羅 switch の変換関数を追加。
4. 必要に応じて `presentation/hooks/useFooValidation.ts` でフォームへ橋渡し。

## 環境上の制約（ドメイン/プレゼン共通）

- 相対 import は `.ts`/`.tsx` 拡張子必須（`verbatimModuleSyntax` + `allowImportingTsExtensions`）。型は `import type`。
- TS `enum` 禁止（`erasableSyntaxOnly`）。`const` オブジェクト＋文字列リテラル共用体で表現する。
- `noUnusedLocals` / `noUnusedParameters` 厳格。

## テストと検証

- 単体テスト（vitest）: `TodoTitle` / `TodoId` の `validate`・`of`、メッセージ変換。
  - `npm test`
- 型チェック／ビルド: `npm run build`（判別共用体と網羅 switch がコンパイル時ガード）。
- Lint: `npm run lint`。
- 手動確認: `npm run dev` — 空欄・256文字・正常入力でのボタン活性とインラインエラー表示。
- `255` がドメイン定義（`TodoTitle.MAX_LENGTH`）とテストにのみ現れること（UI 重複なしの確認）。

## 補足: バックエンドとの関係（範囲外）

本ドキュメントはフロントエンドのドメイン⇄プレゼン統合に限る。
バックエンド（FastAPI / Pydantic）側はタイトル長の検証を持たず、現状フロントエンドより緩い。
契約の真の一元化（OpenAPI 等によるスキーマ共有）は将来の検討事項。
