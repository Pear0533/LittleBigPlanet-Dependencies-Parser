function getResourceDependencies(buf) {
    var pref = '-s';
    var ignoreGuid = false;
    var ignoreSha1 = false;
    if (pref == '-s' || pref == 's') 
        ignoreGuid = true;
    else if (pref == '-g' || pref == 'g') 
        ignoreSha1 = true;
    var offset = 0;
    offset += 8;
    offset = buf.slice(offset, offset + 4).readUInt32BE();
    var dCount = buf.slice(offset, offset + 4).readUInt32BE();
    var entries = [];
    for (i = 0; i < dCount; i++) {
        offset += 4;
        var dataType = buf.slice(offset, offset + 2).readUInt8();
        offset += 1;
        var dataLen = 0;
        var isDataSha1 = dataType == 1;
        var isDataGuid = dataType == 2;
        if (isDataSha1)
            dataLen = 20;
        else if (isDataGuid)
            dataLen = 4;
        if (isDataGuid && !ignoreGuid || isDataSha1 && !ignoreSha1) {
            var entryData = buf.slice(offset, offset + dataLen).toString('hex');
            entries.push(entryData);
        }
        offset += dataLen;
    }
    return entries;
}