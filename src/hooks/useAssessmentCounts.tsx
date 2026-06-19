import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DROUGHT_ASSESMENT_COUNT, DROUGHT_CDI_IMAGE } from "@/config";

const parseDistricts = (raw: unknown): string[] => {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const useAssessmentCounts = () => {
  const [assessment, setAssessment] = useState<any[][]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [cdiImage, setCdiImage] = useState<any>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${DROUGHT_ASSESMENT_COUNT}`);

  //       const data: any[][] = response?.data?.data || [];
  //       setAssessment(data);
  //       // Always use the last row in the array
  //       setFiltered(data[data.length - 1] ?? []);
  //     } catch (error) {
  //       console.error("Assessment fetch error:", error);
  //     }
  //   };

  //   const fetchCDIImage = async () => {
  //     try {
  //       const response = await axios.get(`${DROUGHT_CDI_IMAGE}`);

  //       const data: any[][] = response?.data || [];
  //       // Always use the last row in the array
  //       setCdiImage(data[data.length - 1] ?? []);
  //     } catch (error) {
  //       console.error("Image fetch fetch error:", error);
  //     }
  //   };

  //   fetchCDIImage();
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentResponse, cdiImageResponse] = await Promise.all([
          axios.get(DROUGHT_ASSESMENT_COUNT),
          axios.get(DROUGHT_CDI_IMAGE),
        ]);

        const assessmentData: any[][] = assessmentResponse?.data?.data || [];

        setAssessment(assessmentData);
        setFiltered(assessmentData[assessmentData.length - 1] ?? []);

        const cdiImageData: any[][] = cdiImageResponse?.data?.data || [];

        setCdiImage(cdiImageData[cdiImageData.length - 1] ?? []);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const counts = useMemo(
    () => ({
      extremeCount: filtered?.length ? (filtered[3] ?? 0) : 0,
      severeCount: filtered?.length ? (filtered[4] ?? 0) : 0,
      moderateCount: filtered?.length ? (filtered[5] ?? 0) : 0,
      mildCount: filtered?.length ? (filtered[9] ?? 0) : 0,
      normalCount: filtered?.length ? (filtered[10] ?? 0) : 0,

      trendingCount: filtered?.length ? (filtered[6] ?? 0) : 0,
      improvingCount: filtered?.length ? (filtered[12] ?? 0) : 0,

      month: filtered?.length ? filtered[0]?.trim() : "--",
      year: filtered?.length ? filtered[1]?.trim() : "--",

      extremeDistricts: filtered?.length ? parseDistricts(filtered[13]) : [],
      severeDistricts: filtered?.length ? parseDistricts(filtered[14]) : [],
      improvingDistricts: filtered?.length ? parseDistricts(filtered[15]) : [],
      cdi_image: cdiImage,
    }),
    [filtered],
  );
  console.log("cdiImageData", counts);
  return {
    assessment,
    filtered,
    drought: counts,
    ...counts,
  };
};
