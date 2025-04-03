import { useEffect, useState } from "react";
import styled from "styled-components";
import { getTradeCategory } from "../services/dataService";

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

function TradeFilter({
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}) {
  const [tradeCategory, setTradeCategory] = useState([]);

  useEffect(() => {
    getTradeCategory()
      .then(setTradeCategory)
      .catch((error) => console.error("Fetching error:", error));
  }, []);

  if (!tradeCategory) return <div>...로딩중</div>;

  return (
    <CategorySection>
      <SidebarTitle>카테고리</SidebarTitle>
      {tradeCategory.map((category) => (
        <SidebarLabel key={category.id}>
          <SidebarInput
            type="radio"
            name="category"
            value={category.name}
            checked={selectedCategory === Number(category.id)}
            onChange={() => {
              setSelectedCategory(Number(category.id));
              setCurrentPage(1);
            }}
          />
          {category.name}
        </SidebarLabel>
      ))}
    </CategorySection>
  );
}
export default TradeFilter;
