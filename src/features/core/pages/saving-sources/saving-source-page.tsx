import { SavingsSourceList } from "@/features/core/pages/saving-sources/components/saving-source-list";

const SavingSourcePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Savings Sources</h1>
      <SavingsSourceList />
    </div>
  );
};

export { SavingSourcePage };
