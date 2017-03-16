module.exports = function(app){
    var MongoDB = app.dataSources.MongoDB;

    MongoDB.automigrate('Customer', function(err) {
        if (err) throw (err);
        var Customer = app.models.Customer;

        // List of "Customers" that we want ot create at startup
        Customer.create([
            {username: 'admin', email: 'admin@admin.com', password: 'abcdef'},
            {username: 'arkaitz', email: 'muppala@ust.hk', password: 'abcdef'}
        ], function(err, users) {
            if (err) throw (err);
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;
            
            // create the admin role
            Role.create({
                name: 'admin'
            }, function(err, role) {
                if (err) throw (err);
                //make admin
                role.principals.create({
                    principalType: RoleMapping.USER,
                    principalId: users[0].id // Make the 1st user admin
                }, function(err, principal) {
                    if (err) throw (err);
                });
            });

            /*
            //create the admin role if it doesn't already exist
            Role.find({name: 'admin'}, function(err,result) {
                if (err) throw err;
                if (result.length < 1) {
                    // Create the 'admin' role because it doesn't exist yet
                    Role.create({
                        name: 'admin'
                    }, function(err, role) {
                        if (err) throw (err);
                        //make admin
                        role.principals.create({
                            principalType: RoleMapping.USER,
                            principalId: users[0].id // Make the 1st user admin
                        }, function(err, principal) {
                            if (err) throw (err);
                        });
                    });
                }
            });
            */
        });
    });
};