"use client";

import BlobCharacter from "@/components/BlobCharacter";
import MealLogButtons from "@/components/MealLogButtons";
import PointsStatus from "@/components/PointsStatus";

export default function MyDearTab() {
  return (
    <>
      <section className="px-6 pt-6 text-center">
        <p className="text-sm leading-relaxed text-earth-500">
          "완벽한 한 명보다, 불완전한 다수의
          <br />
          다정한 발걸음이 지구를 숨 쉬게 합니다."
        </p>
      </section>

      <section className="flex flex-col items-center">
        <BlobCharacter />
      </section>

      <section className="w-full">
        <MealLogButtons />
      </section>

      <section className="w-full">
        <PointsStatus />
      </section>
    </>
  );
}
