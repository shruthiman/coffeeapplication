$(document).ready(function(){
    var _selectLoc = $('#matchLocation'),
        _selectDap = $('#matchDepartment'),
        _refresh = $('#refresh'),
        _model = $('.cw-loader-model'),
        _layout = $('#layoutData'),
        _location, _department,
        _length,
        
        _allLocations = {
            ny : 'New York',
            dub: 'Dublin'
        };
    function getData(location, department, callBack){
        var url = 'https://hbc-frontend-challenge.hbccommon.private.hbc.com/coffee-week/users';
        var query = '';
        _model.addClass('show');
        if(location){
            query = 'location=' + location;
        }
        if(department){
           query && (query += '&');
           query += 'department=' + department;   
        }
        if(query){
            url += '?' + query;
        }

        $.ajax({
            url: url
        }).done(function(data){
            var users = ( data || {}).users || []; 
            callBack && callBack(users);
        });
    }
    function tileHtml(id , user){
        var _html = '<div class="cw-tile"> <div class="cw-match">' + 
        '<div class="cw-match-title">Pair#'+ id + 
        '</div><div class="cw-match-inner">' + 
        '<table class="cw-match-table">' + 
        '<tr><td class="cw-match-subtitle" colspan="2"> Giver Details</td></tr>' + 
        '<tr><td>Name</td><td>' + user.giver.name +
        '</td></tr><tr><td>Location</td><td>' + user.giver.location +  '</td></tr>' + 
        '<tr><td>Department</td><td>' + user.giver.department + '</td></tr>' + 
        '<tr><td class="cw-match-subtitle" colspan="2">Receiver Details</td></tr>' + 
        '<tr><td>Name</td><td>' + user.receiver.name +
        '</td></tr><tr><td>Location</td><td>' + user.receiver.location +  '</td></tr>' + 
        '<tr><td>Department</td><td>' + user.receiver.department + '</td></tr>' + 
        '</table></div></div></div>';
        return _html;
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * (_length - 1 + 1)) + 1;
    }

    function getMatchObject(data, id){
        var obj = {}, actual = {};
        actual = data[id];
        obj.name = actual.name.first + ' ' + actual.name.last;
        obj.location = _allLocations[actual.location];
        obj.department = actual.department;
        return obj;
    }

    function prepareData(data){
        var _data = [], _found, position, mapObj = {};
        var _giverList = [] , _receiverList = [];
        for(var i = 0; i < _length; i++){
            mapObj = {};
            _found = true;
            while(_found){
                position = getRandomNumber();
                if(_giverList.indexOf(position) < 0){
                    mapObj.giverPosition = position;
                    mapObj.giver = getMatchObject(data, position - 1);
                    _found = false;
                    _giverList.push(position);                    
                }
            }
            _found = true;
            while(_found){
                position = getRandomNumber();
                if(position !== mapObj.giverPosition && _receiverList.indexOf(position) < 0){
                    mapObj.receiver = getMatchObject(data, position - 1);
                    _found = false;
                    _receiverList.push(position);                    
                }
            }
            _data.push(mapObj);
            if(_length === 2){
                break;
            }
        }

        return _data;
    }

    function reConstructLayout(data){
        var _html = '';
        _length = data.length;
        var _data = prepareData(data);
        for(var i = 0; i < _data.length; i++){
            _html += tileHtml(i + 1, _data[i]);
        }
        _layout.html(_html);
        _model.removeClass('show');
    }
    function refresh(){
        getData(_location, _department, reConstructLayout);
    }
    function changePairMatch(){
        _location = _selectLoc.val();
        _department = _selectDap.val();
        getData(_location, _department, reConstructLayout);
    }
    _selectLoc.on('change', changePairMatch);
    _selectDap.on('change', changePairMatch);
    _refresh.on('click', refresh);
    refresh();
});