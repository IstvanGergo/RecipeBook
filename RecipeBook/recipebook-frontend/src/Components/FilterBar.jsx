import { useState } from "react";

export default function FilterBar({ recipes, setFiltered }) {
    const [search, setSearch] = useState("");

    const handleFilter = () => {
        setFiltered(
            recipes.filter((r) =>
                r.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    };

    return (
        <div className="filter-bar">
            <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleFilter}>Filter</button>
        </div>
    );
}
