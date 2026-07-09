import React from "react";
import { NavLink } from "react-router-dom";
import {
    CirclePlus,
    UtensilsCrossed,
    ShoppingBag,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-options">
                <NavLink to="/add" className="sidebar-option">
                    <CirclePlus size={22} />
                    <p>Add Items</p>
                </NavLink>

                <NavLink to="/list" className="sidebar-option">
                    <UtensilsCrossed size={22} />
                    <p>List Items</p>
                </NavLink>

                <NavLink to="/orders" className="sidebar-option">
                    <ShoppingBag size={22} />
                    <p>Orders</p>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;