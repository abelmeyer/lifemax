import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import { NutritionIcon } from "../components/icons";

export default function Nutrition() {
  return (
    <>
      <ScreenHeader
        title="Nutrition"
        subtitle="Protein and calories, tracked simply."
      />
      <EmptyState
        icon={<NutritionIcon width={22} height={22} />}
        title="No meals logged"
        message="Add a meal to start tracking protein and calories for the day."
      />
    </>
  );
}
