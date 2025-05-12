function handler(event) {
    var request = event.request;
    var headers = request.headers;
  
    var remove_suffix = '.sdk-poc.superfreeq.com';
    // Extract the host header, e.g., foo.example.com
    var host_header = headers['host'] ? headers['host'].value : '';


    if(host_header.endsWith(remove_suffix) && host_header !== remove_suffix)
    {
        // prepend '/' + the subdomain onto the existing request path ("uri")
        request.uri = '/' + host_header.substring(0,host_header.length - remove_suffix.length) + request.uri;
    }

    return request
    // fix the host header so that S3 understands the request
    // headers.host[0].value = remove_suffix;

    // // return control to CloudFront with the modified request
    // return callback(null,request);
}