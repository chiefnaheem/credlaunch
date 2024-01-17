import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpServiceModule } from "src/common/http/http.module";
import { WalletController } from "./controller/wallet.controller";
import { Wallet } from "./entities/wallet.entity";
import { WalletListener } from "./listener/wallet.listener";
import { WalletService } from "./services/wallet.service";

@Module({
    imports: [TypeOrmModule.forFeature([Wallet]), HttpServiceModule],
    controllers: [WalletController],
    providers: [WalletService, WalletListener],
    exports: [WalletService],
  })
  export class WalletModule {}