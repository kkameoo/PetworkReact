import { useEffect, useState } from "react";
import styled from "styled-components";
import { getLocalCategory } from "../services/dataService";

// 지역 선택 부분을 감싸는 div에 스타일 추가
const RegionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
`;
const CategorySection = styled.div`
  margin-top: 20px;
`;
const SidebarTitle = styled.h3`
  margin-left: 25px;
  text-align: left;
  margin-bottom: 10px;
  color: #727d73;
`;

const SidebarLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #727d73;
  transition: all 0.2s ease-in-out;
  border: 0.5px solid #6dbe92;

  ${({ selected }) =>
    selected
      ? `
    background-color: #6dbe92;
    color: white;
    border-color: #6dbe92;
  `
      : `
    background-color : #a2e4b8;
    &:hover {
      background-color: #6dbe92;
    }
  `}
`;

const SidebarInput = styled.input`
  margin-right: 5px;
  display: none;
`;

function SideFilter({
  selectedRegion,
  setSelectedRegion,
  selectedGu,
  setSelectedGu,
}) {
  const [regionMap, setRegionMap] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  useEffect(() => {
    getLocalCategory()
      .then(setRegionMap)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  if (!regionMap) return <div>...로딩중</div>;

  return (
    <>
      <RegionSection>
        <SidebarTitle>지역 선택</SidebarTitle>
        {regionMap.map((region) => (
          <SidebarLabel key={region.id}>
            <SidebarInput
              type="radio"
              name="region"
              value={region.name}
              checked={selectedRegion === region.name}
              onChange={() => {
                setSelectedRegion(region.name);
                setSelectedRegionId(region.id);
                setSelectedGu("전체");
              }}
            />
            {region.name}
          </SidebarLabel>
        ))}
      </RegionSection>

      {selectedRegion !== "전체" && (
        <select
          value={selectedGu}
          onChange={(e) => setSelectedGu(e.target.value)}
          style={{
            marginLeft: "25px",
            marginBottom: "20px",
            padding: "5px",
          }}
        >
          <option value="전체">-- 구 선택 --</option>
          {regionMap[selectedRegionId]?.gu.map((gu) => (
            <option key={gu.id} value={gu.name}>
              {gu.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
}

export default SideFilter;
