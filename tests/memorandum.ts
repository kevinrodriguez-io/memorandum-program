import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";
import { Memorandum } from "../target/types/memorandum";
import { b, toBytes } from "./helpers/string";

const getMemorandumPDA = (
  wallet: anchor.Wallet,
  title: string,
  program: anchor.Program<Memorandum>
) =>
  anchor.web3.PublicKey.findProgramAddress(
    [b`memorandum`, wallet.publicKey.toBytes(), toBytes(title)],
    program.programId
  );

describe("memorandum", () => {
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Memorandum as Program<Memorandum>;
  const wallet = anchor.Wallet.local();

  const title = "About me";
  const contents = "Hello, my name is Kevin and I LOVE to code!";

  it("Creates a memorandum correctly", async () => {
    const [memorandumPDA] = await getMemorandumPDA(wallet, title, program);
    const txId = await program.methods
      .createMemo(title, contents)
      .accounts({
        memorandum: memorandumPDA,
        signer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer])
      .rpc();
    expect(txId).to.be.a("string");
  });

  it("Checks created memorandum", async () => {
    const [memorandumPDA] = await getMemorandumPDA(wallet, title, program);
    const account = await program.account.memorandum.fetch(memorandumPDA);
    expect(account.title).to.equals(title);
    expect(account.contents).to.equals(contents);
    expect(account.owner.equals(wallet.publicKey)).to.be.true;
  });
});
