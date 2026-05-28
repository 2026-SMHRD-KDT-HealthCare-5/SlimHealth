import React, { useContext, useEffect, useRef, useState } from "react";
import Context from "../../context/context";
import { useMutation } from "@tanstack/react-query";
import { ocrInputApi } from "../../api/healthDataApi";
import { ocrImageSize } from "../../utils/utils";
import { Button } from "../../components/Button/Button";

const OcrInputBox = ({ setFormData }) => {
  const { isLoading, setIsLoading } = useContext(Context);
  //ocr 이미지
  const [ocrImages, setOcrImages] = useState(null);

  const fileInputRef = useRef(null);

  // 파일 선택 버튼 클릭
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 시 실행
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files) {
      setOcrImages(files);

      //ocr 입력 api 연결
      handleOcrInput(files);
    }
  };

  //ocr api 연결
  const ocrMutation = useMutation({
    mutationFn: ocrInputApi,

    onMutate: () => {
      setIsLoading(true);
    },

    onSuccess: (data) => {
      const ocr = data.ocr;

      setFormData({
        userHeight: ocr.height,
        userWeight: ocr.weight,
        waistLine: ocr.waist,
        cholesterol: ocr.hdl,
        systolicBp: ocr.sbp,
        diastolicBp: ocr.dbp,
        bloodGlucose: ocr.bs,
        triglyceride: ocr.tg,
      });
    },

    onSettled: () => {
      setIsLoading(false);
    },
  });

  //ocr로 입력
  const handleOcrInput = (files) => {
    ocrMutation.mutate(files);
  };

  useEffect(() => {
    return () => {
      if (ocrImages) {
        ocrImages.forEach((item) => {
          URL.revokeObjectURL(item.preview);
        });
      }
    };
  }, [ocrImages]);
  return (
    <div className="vertical-flex">
      <div style={{ width: ocrImageSize + 20, height: ocrImageSize + 20 }}>
        {ocrImages && (
          <>
            {ocrImages[0].type === "application/pdf" ? (
              <iframe
                src={URL.createObjectURL(ocrImages[0])}
                width={ocrImageSize}
                height={ocrImageSize}
                title="pdf-viewer"
              />
            ) : (
              <img
                src={URL.createObjectURL(ocrImages[0])}
                alt="preview"
                style={{
                  width: ocrImageSize,
                  height: ocrImageSize,
                  objectFit: "cover",
                }}
              />
            )}
          </>
        )}
      </div>
      <div className="horizontal-flex flex-align-center">
        <Button onClick={handleButtonClick}>OCR로 입력</Button>
      </div>
      <input
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default OcrInputBox;
