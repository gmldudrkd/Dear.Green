"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePoints } from "@/context/PointsContext";
import { stages, getStage, getNextStage } from "@/lib/growth";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PlantEncyclopedia({ open, onClose }: Props) {
  const { ip } = usePoints();
  const currentStage = getStage(ip);
  const nextStage = getNextStage(ip);

  return (
    <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 배경 오버레이 */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={onClose}
            />

            {/* 모달 시트 */}
            <motion.div
              className="relative z-10 w-full max-w-md rounded-t-3xl bg-sand-50 px-6 pb-8 pt-4"
              style={{ maxHeight: "85vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* 핸들 바 */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-sand-300" />

              {/* 헤더 */}
              <div className="mb-4 text-center">
                <h2 className="text-lg font-bold text-earth-800">
                  나의 작은 새싹 성장기
                </h2>
                <p className="mt-1 text-xs text-earth-400">
                  다정한 기록은 햇살이 되고, 타협하는 마음은 단비가 됩니다
                </p>
                {nextStage && (
                  <p className="mt-2 text-xs font-medium text-sage-600">
                    다음 성장까지 {nextStage.minIP - ip}IP 남았어요!
                  </p>
                )}
              </div>

              {/* 성장 단계 리스트 */}
              <div
                className="flex flex-col gap-3 overflow-y-auto pr-1"
                style={{ maxHeight: "60vh" }}
              >
                {stages.map((stage, index) => {
                  const unlocked = ip >= stage.minIP;
                  const isCurrent = stage.level === currentStage.level;

                  return (
                    <motion.div
                      key={stage.level}
                      className={`rounded-2xl p-4 ${
                        isCurrent
                          ? "bg-white shadow-md"
                          : unlocked
                            ? "bg-white shadow-sm"
                            : "bg-sand-100"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${
                            unlocked
                              ? "bg-sage-100"
                              : "bg-sand-200 grayscale"
                          }`}
                        >
                          {unlocked ? stage.icon : "?"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-sage-600">
                              Lv.{stage.level}
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                unlocked
                                  ? "text-earth-800"
                                  : "text-earth-300"
                              }`}
                            >
                              {unlocked ? stage.name : "???"}
                            </span>
                            {isCurrent && (
                              <span className="rounded-full bg-sage-500 px-2 py-0.5 text-[10px] text-white">
                                현재
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-earth-400">
                            {stage.minIP}+ IP
                          </p>
                          <p
                            className={`mt-2 text-xs leading-relaxed ${
                              unlocked
                                ? "text-earth-600"
                                : "text-earth-300"
                            }`}
                          >
                            {unlocked
                              ? stage.description
                              : "아직 도달하지 못한 단계예요. 조금만 더 기록해 볼까요?"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* 도감 서문 */}
                <div className="mt-2 rounded-2xl border border-dashed border-sage-300 p-4 text-center">
                  <p className="text-xs leading-relaxed text-earth-500">
                    "이 도감은 완벽한 정답지가 아닙니다.
                    <br />
                    당신이 지구와 가까워지기 위해 고민한 흔적을 기록한
                    &lsquo;성장 일기&rsquo;입니다."
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
  );
}
