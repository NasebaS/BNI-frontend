// Table data
export interface Table {
    name: string;
    id: string;
    aname: string;   
}

// Search Data
export interface SearchResult {
    tables: Table[];
    total: number;
}
