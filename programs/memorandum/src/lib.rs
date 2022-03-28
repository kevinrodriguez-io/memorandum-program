pub mod constants;
pub mod helpers;

use crate::{constants::MEMORANDUM, helpers::string_size};
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod memorandum {
    use super::*;
    pub fn create_memo(
        ctx: Context<CreateMemorandum>,
        title: String,
        contents: String,
    ) -> Result<()> {
        let memorandum = &mut ctx.accounts.memorandum;
        memorandum.owner = ctx.accounts.signer.key();
        memorandum.title = title;
        memorandum.contents = contents;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, contents: String)]
pub struct CreateMemorandum<'info> {
    #[account(
        init,
        payer = signer,
        // How to calculate space :) https://book.anchor-lang.com/chapter_5/space.html
        space = 8 +                             // Discriminator
                32 +                            // Owner
                4 + string_size(&title) +       // Title
                4 + string_size(&contents),     // Contents
        seeds = [MEMORANDUM, signer.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub memorandum: Account<'info, Memorandum>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Memorandum {
    pub owner: Pubkey,    // 32
    pub title: String,    // 4 + n
    pub contents: String, // 4 + n
}
