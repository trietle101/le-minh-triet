// NOTE: Commented code are original code, the code right below it are optimized ones

interface WalletBalance {
  currency: string;
  amount: number;
  //Additional property
  blockchain: string;
}

// interface FormattedWalletBalance {
//   currency: string;
//   amount: number;
//   formatted: string;
// }
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  //Unused children
  // const { children, ...rest } = props;
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          // Wrong logic (balance.amount <= 0) and not clean
          // {
          //   const balancePriority = getPriority(balance.blockchain);

          //   // if (lhsPriority > -99) {
          //   //   if (balance.amount <= 0) {
          //   //     return true;
          //   //   }
          //   // }
          // }
          getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        //Not clean and too much excess steps
        // if (leftPriority > rightPriority) {
        //   return -1;
        // } else if (rightPriority > leftPriority) {
        //   return 1;
        // }
        return leftPriority - rightPriority;
      });
    //prices not changed
    // }, [balances, prices]);
  }, [balances]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    };
  });

  //Render formattedBalances not sortedBalances
  // const rows = sortedBalances.map(
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
