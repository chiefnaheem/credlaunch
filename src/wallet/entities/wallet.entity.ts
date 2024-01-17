import { BaseEntity } from 'src/common/entity/base.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({
  name: 'wallet',
})
export class Wallet extends BaseEntity {
    @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE', nullable: false })
    user: string;

    @Column({ nullable: false })
    balance: number;

    @Column({ nullable: false })
    currency: string;

    @Column({ nullable: true })
    isDefault: boolean;

    @Column({ nullable: false, unique: true })
    accountNumber: string;

    @OneToMany(() => Transaction, (transaction) => transaction.senderWallet)
    transactions: Transaction[];

    @OneToMany(() => Transaction, (transaction) => transaction.receiverWallet)
    receivedTransactions: Transaction[];

    @Column({ nullable: true })
    isLocked: boolean;

}
