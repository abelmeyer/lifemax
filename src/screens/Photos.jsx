import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import { PhotosIcon } from "../components/icons";

export default function Photos() {
  return (
    <>
      <ScreenHeader
        title="Photos"
        subtitle="Visual progress over time."
      />
      <EmptyState
        icon={<PhotosIcon width={22} height={22} />}
        title="No progress photos"
        message="Capture a photo to start building your visual timeline."
      />
    </>
  );
}
