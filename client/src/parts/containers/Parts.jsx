// Libraries
import React, { Component } from 'react';
import {
    GridComponent, ColumnsDirective, ColumnDirective, Page, Selection,
    Inject, Edit, Toolbar, Sort, Filter,
} from '@syncfusion/ej2-react-grids';
import { Ajax } from '@syncfusion/ej2-base';
import { connect } from "react-redux";

// Helpers
import { partsData, partsGrid } from '../../data/dummy';

// Components
import { Header } from '../../components';

// Actions
import { getParts } from '../../store/index';



class Parts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toolbarOptions: ['Add', 'Delete', 'Edit', 'Cancel', 'Update'],
            editing: {
                allowDeleting: true,
                allowEditing: true,
                allowAdding: true,
                // showDeleteConfirmDialog: true
            },
            data: []
        }
    }

    componentDidMount() {
        this.props.getParts();
    }

    dataSourceChanged = (args) => {
        console.log(args);
    }

    render() {
        const { toolbarOptions, editing } = this.state;
        const { parts, parts_total_count } = this.props;
        console.log(parts);

        return (
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Parts" />
                <GridComponent
                    ref={g => this.grid = g}
                    dataSource={parts?.result}
                    enableHover={true}
                    allowPaging
                    pageSettings={{
                        pageSize: 10,

                    }}
                    selectionSettings={{ persistSelection: true, type: 'Single' }}
                    toolbar={toolbarOptions}
                    editSettings={editing}
                    allowSorting
                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                    actionComplete={this.actionComplete}
                    dataSourceChanged={this.dataSourceChanged}
                >
                    <ColumnsDirective>
                        {partsGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
                    </ColumnsDirective>
                    <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
                </GridComponent>
            </div >
        );
    }
};

const mstp = (state) => {
    return {
        parts: state.part.parts,
        parts_total_count: state.part.parts_total_count
    }
}

const mdtp = (dispatch) => {
    return {
        getParts: () => dispatch(getParts())
    }
}

export default connect(mstp, mdtp)(Parts);
