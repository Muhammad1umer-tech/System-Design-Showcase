import { useState, useCallback, useEffect, useMemo, useRef} from 'react';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import axiosInstance from '../../Helper/axiosInstance';

const Export = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(''); // Corrected casing for consistency
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/get_all_post_admin/');
      let datas =response.data

      datas.forEach(data => {
        const tagsList = data['tags'];
        const tagsString = tagsList.join(', ');
        data['tags'] = tagsString;
    });


    setData(datas)

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportData = useCallback(() => {
    const filteredModel = gridRef.current.api.getModel();
    const filteredData = filteredModel.rootNode.childrenAfterFilter;
    const filteredDataArray = filteredData.map(node => node.data);

    axiosInstance.post('/json_into_csv_Export/', { 'data': filteredDataArray })
      .then(res => {
        setError(res.data);
      })
      .catch(err => {
        setError(err);
      });
  }, [data]);


  const exportDataPDF = useCallback(() => {
    const filteredModel = gridRef.current.api.getModel();
    const filteredData = filteredModel.rootNode.childrenAfterFilter;
    const filteredDataArray = filteredData.map(node => node.data);

    axiosInstance.post('/json_into_pdf_Export/', { 'data': filteredDataArray })
      .then(res => {
        setError(res.data);
      })
      .catch(err => {
        setError(err);
      });
  }, [data]);


  const [colDefs, setColDefs] = useState([
    { field: "id", filter: true }, // Enable filter for "id" column
    { field: "Post_Textfield", filter: true }, // Enable filter for "Post_Textfield" column
    { field: "views", filter: true }, // Enable filter for "views" column (optional)
    { field: "like", filter: true }, // Enable filter for "like" column (optional)
    { field: "Category", filter: true }, // Enable filter for "like" column (optional)
    { field: "tags", filter: true }, // Enable filter for "like" column (optional)
  ]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    filter: true, // Enable filter by default for all columns
    floatingFilter: true, // Optionally enable floating filters for quick access
  }), []);

  return (
    <div>
      <div className="ag-theme-quartz" style={{ margin: 'auto', width: 1000, height: 500 }}>
        <AgGridReact
          rowData={data}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          ref={gridRef}
          groupDisplayType={"multipleColumns"}
        />
      </div>
      <button onClick={exportData} style={{ marginTop: '30px' }}>
        Export CSV
      </button>

      <button onClick={exportDataPDF} style={{ marginLeft: '40px', marginTop: '30px' }}>
        Export PDF
      </button>


      <div style={{ marginTop: '10px' }}>
        {error ? error : null}
      </div>
    </div>
  );
};

export default Export;
