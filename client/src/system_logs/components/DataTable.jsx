import * as React from 'react';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

//date, offer_id, page, type, by
const columns = [
    { align: "left", headerAlign: "left", field: 'id', headerName: 'ID', width: 100 },
    { align: "left", headerAlign: "left", field: 'date', headerName: 'Date', type: 'date', width: 200 },
    { align: "left", headerAlign: "left", field: 'offer_id', headerName: 'Offer ID', type: 'number', width: 150 },
    { align: "left", headerAlign: "left", field: 'page', headerName: 'Page', width: 250 },
    { align: "left", headerAlign: "left", field: 'type', headerName: 'Type', width: 200 },
    { align: "left", headerAlign: "left", field: 'by', headerName: 'By', width: 300 }
];

const rows = [
    { id: 1, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 2, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 3, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 4, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 5, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 6, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 7, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 8, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 9, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 10, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 11, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 12, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 13, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 14, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" },
    { id: 15, date: "01.07.2023 23:02", offer_id: 5, page: "ThreeJS", type: "Edit", by: "John Doe" }
];

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbar />
      </GridToolbarContainer>
    );
}

export default function DataTable(props) {
    const [pageSize, setPageSize] = React.useState(5);
    const { loading } = props
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={loading ? [] : rows}
                columns={columns}
                loading={loading}
                pagination
                components={{
                    Toolbar: CustomToolbar,
                }}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                pageSize={pageSize}
                onPageSizeChange={(pageSize) => setPageSize(pageSize)}
            />
        </div>
    );
}