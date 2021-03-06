import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getRuleFields } from './netaudit-actions';
import { AgGridReact } from 'ag-grid-react';
import { getQueryForAGGridSortAndFilter } from '../../utils/aggrid-to-jqdt-queries';
import axios from '../../api/config';
import { ProgressBar, Intent, ButtonGroup, Button } from "@blueprintjs/core"; 

class NetAuditRuleData extends React.Component{
    static icon = "wrench";
    static label = "";
    constructor(props){
        super(props);
        
        this.columnDefs = []
        
        this.state = {
            columnDefs: [],
            rowData: [
            ],
            rowBuffer: 0,
            rowSelection: "multiple",
            rowModelType: "infinite",
            paginationPageSize: 100,
            cacheOverflowSize: 2,
            maxConcurrentDatasourceRequests: 2,
            infiniteInitialRowCount: 1,
            maxBlocksInCache: 2
        };
    }
    
    componentDidMount() {
        if(this.props.fields.length === 0 ){
            this.props.dispatch(getRuleFields(this.props.options.ruleId));
        }
        
    }
    
    updateColumnDefs(){
        this.columnDef = [];
        if( typeof this.props.fields === 'undefined'  ) return;
        for(var key in this.props.fields){
            let columnName = this.props.fields[key]
            if( columnName === 'pk') continue;
            this.columnDef.push(
                {headerName: columnName.toUpperCase(), field: columnName,  
                 filter: "agTextColumnFilter"},);
        }
    }

    
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        let _columnApi =  params.columnApi;
        let token = this.props.token;
        let _fields = this.props.fields;
        let _dispatch = this.props.dispatch;
        let ruleId = this.props.options.ruleId;
        
        let dataSource = {  
            rowCount: null,
            getRows: function(params) {
                let page = params.startRow;
                let length= params.endRow - params.startRow;
                let apiEndPoint = "/api/networkaudit/rule/dt/" + ruleId + "?start="+  page + "&length=" + length;
                
                let query = getQueryForAGGridSortAndFilter( _fields, 
                        params.sortModel, params.filterModel, _columnApi.getAllColumns());
                
                apiEndPoint += "&" + query;
                
                axios.get(apiEndPoint,{
                    headers: { "Authorization": token }
                })
                .then(response => {
                    var lastRow = response.data.recordsFiltered;
                    params.successCallback(response.data.data, lastRow);
                })
                .catch(function(error){
                    //_dispatch(notifyNodesRequestFailure(entity, "Failed to fetch data"));
                });
            }
        };
        this.gridApi.setDatasource(dataSource);
    }
    
    render(){
        this.updateColumnDefs();
        
        return (
            <div>
            <h3><FontAwesomeIcon icon={NetAuditRuleData.icon}/> {this.props.options.title}</h3>        
                <div className="card">
                    <div className="card-body p-2">
                        <div className="mb-1">
                        <ButtonGroup minimal={true}>
                            <Button icon="refresh" onClick={this.refreshData}></Button>
                            <Button icon="download" onClick={this.downloadData}></Button>
                        </ButtonGroup>
                        </div>
                        <div className="ag-theme-balham" style={{width: '100%', height: "100%", boxSizing: "border-box"}}>
                            <AgGridReact
                                pagination={true}
                                gridAutoHeight={true}
                                columnDefs={this.columnDef}
                                components={this.state.components}
                                enableColResize={true}
                                rowBuffer={this.state.rowBuffer}
                                debug={true}
                                rowSelection={this.state.rowSelection}
                                rowDeselection={true}
                                rowModelType={this.state.rowModelType}
                                paginationPageSize={this.state.paginationPageSize}
                                cacheOverflowSize={this.state.cacheOverflowSize}
                                maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
                                infiniteInitialRowCount={this.state.infiniteInitialRowCount}
                                maxBlocksInCache={this.state.maxBlocksInCache}
                                enableServerSideSorting={true}
                                enableServerSideFilter={true}
                                onGridReady={this.onGridReady.bind(this)}
                                >
                            </AgGridReact>

                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    
    if ( typeof state.netaudit.rulesdata[ownProps.options.ruleId] === 'undefined'){
        return {
            requesting: false,
            requestError:  null,
            token: state.session.userDetails.token,
            fields: []
        };
    }
    
    return {
            requesting: state.netaudit.rulesdata[ownProps.options.ruleId].requesting,
            requestError:  state.netaudit.rulesdata[ownProps.options.ruleId].requestError,
            token: state.session.userDetails.token,
            fields: state.netaudit.rulesdata[ownProps.options.ruleId].fields
    };
}

export default connect(mapStateToProps)(NetAuditRuleData);