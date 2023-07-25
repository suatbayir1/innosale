
import { connect } from "react-redux"
import React, { Component, useRef } from "react"
import withRouter from "../../shared/hoc/withRouter"

import { Header } from "../../components";
import { Button, ButtonBase, Stack, TextField } from "@mui/material";
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import DataTable from "../components/DataTable";
import FilterSelect from "../components/FilterSelect";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


class SystemLogs extends Component {
    constructor (props) {
        super(props)

        this.state = {
            'table_loading': false,
            'filder_start_date': '01.07.2023 00:00',
            'filter_end_date': '31.07.2023 23:59',
            'filter_page': [],
            'filter_type': [],
            'filter_offer_id': [],

            'list_page': ['Offers', 'All Parts', 'All Operations', 'Similarity Calculator', 'Similar Part Finder', 'ThreeJS'],
            'list_type': ['Add', 'Edit', 'Delete'],
            'list_offer_id': [1,2,3,4,5,6,7,8,9,10],
        }
    }

    wait_for_seconds = (second) => {
        return new Promise((resolve) => setTimeout(resolve, second * 1000))
    }

    load_table = async () => {
        await this.setState({ table_loading: true })
        await this.wait_for_seconds(2)
        await this.setState({ table_loading: false })
    }
 
    handleChange = (event, filter_name) => {
        this.setState({ [filter_name]: event.target.value })
    }
    
    handleDelete = (value, filter_name) => {
        var array = [...this.state[filter_name]]
        var index = array.indexOf(value)
        if (index !== -1) {
            array.splice(index, 1)
            this.setState({ [filter_name]: array })
        }
    }
  
    render() {
        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="System Logs" />
                <Stack direction={"column"} spacing={3}>

                    <Stack direction={"row"} spacing={3}>
                    {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker label="Basic date time picker" />
        </LocalizationProvider>*/}
                        <TextField label = "Start Date" value = {this.state.filder_start_date} />
                        <TextField label = "End Date" value = {this.state.filter_end_date} />
                        <Button variant="outlined" startIcon={<CleaningServicesOutlinedIcon />} onClick={() => this.setState({ filter_page: [], filter_type: [], filter_offer_id: [] })}>Clear</Button>
                        <Button variant="contained" startIcon={<DocumentScannerOutlinedIcon />} onClick={this.load_table}>Get Logs</Button>
                    </Stack>
                        
                    <Stack direction={"row"} spacing={3}>
                        <FilterSelect
                            header = "Page"
                            minWidth = {500}
                            handleDelete = { value => this.handleDelete(value, 'filter_page') }
                            handleChange = { event => this.handleChange(event, 'filter_page') }
                            filterValue = {this.state.filter_page}
                            filterList = {this.state.list_page}
                        />
                        <FilterSelect
                            header = "Type"
                            minWidth = {300}
                            handleDelete = { value => this.handleDelete(value, 'filter_type') }
                            handleChange = { event => this.handleChange(event, 'filter_type') }
                            filterValue = {this.state.filter_type}
                            filterList = {this.state.list_type}
                        />
                        <FilterSelect
                            header = "OfferID"
                            minWidth = {200}
                            handleDelete = { value => this.handleDelete(value, 'filter_offer_id') }
                            handleChange = { event => this.handleChange(event, 'filter_offer_id') }
                            filterValue = {this.state.filter_offer_id}
                            filterList = {this.state.list_offer_id}
                        />
                    </Stack>
                    <DataTable
                        loading={this.state.table_loading}
                    />
                </Stack>
                
            </div>
        )
    }
}

const mstp = (state) => {
    return {
        
    }
}

const mdtp = (dispatch) => {
    return {
        
    }
}

export default withRouter(connect(mstp, mdtp)(SystemLogs))
