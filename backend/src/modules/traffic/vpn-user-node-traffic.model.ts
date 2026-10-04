import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import sequelize
    from "../../database/sequelize";

import User
    from "../users/user.model";

import VpnNode
    from "../vpn-nodes/vpn-node.model";


class VpnUserNodeTraffic extends Model<
    InferAttributes<VpnUserNodeTraffic>,
    InferCreationAttributes<VpnUserNodeTraffic>
> {

    declare user_id:
        ForeignKey<User["id"]>;

    declare node_id:
        ForeignKey<VpnNode["id"]>;


    declare uplink_bytes:
        string;

    declare downlink_bytes:
        string;


    declare last_xray_uplink:
        string;

    declare last_xray_downlink:
        string;


    declare updated_at:
        Date;
}


VpnUserNodeTraffic.init(
    {
        user_id: {
            type:
            DataTypes.INTEGER,

            allowNull:
                false,

            primaryKey:
                true,
        },


        node_id: {
            type:
            DataTypes.INTEGER,

            allowNull:
                false,

            primaryKey:
                true,
        },


        uplink_bytes: {
            type:
            DataTypes.BIGINT,

            allowNull:
                false,

            defaultValue:
                "0",
        },


        downlink_bytes: {
            type:
            DataTypes.BIGINT,

            allowNull:
                false,

            defaultValue:
                "0",
        },


        last_xray_uplink: {
            type:
            DataTypes.BIGINT,

            allowNull:
                false,

            defaultValue:
                "0",
        },


        last_xray_downlink: {
            type:
            DataTypes.BIGINT,

            allowNull:
                false,

            defaultValue:
                "0",
        },


        updated_at: {
            type:
            DataTypes.DATE,

            allowNull:
                false,

            defaultValue:
            DataTypes.NOW,
        },
    },
    {
        sequelize,

        tableName:
            "vpn_user_node_traffic",

        timestamps:
            false,
    },
);


export default VpnUserNodeTraffic;