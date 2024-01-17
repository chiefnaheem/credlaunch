import { BaseEntity } from 'src/common/entity/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TransactionStatus } from '../enum/transaction.enum';

@Entity({
  name: 'transaction',
})
export class Transaction extends BaseEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  senderWallet: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.receivedTransactions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  receiverWallet: string;

  @Column({ nullable: false })
  receiverAccountNumber: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false, enum: Object.values(TransactionStatus) })
  status: string;

  @Column({ nullable: false })
  currency: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: false })
  narration: string;

  @Column({ nullable: false })
  senderBalance: number;

  @Column({ nullable: false })
  receiverBalance: number;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  createdBy: string;
}
