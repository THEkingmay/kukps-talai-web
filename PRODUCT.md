# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, React Router 8, Tailwind CSS v4, Supabase, Upstash Redis, Leaflet, MQTT

## Users

Strictly university staff and administrators (Super Admin and Admin roles) managing the KUKPS "Talai" shuttle bus fleet. They operate this system in an administrative setting to oversee routes, drivers, and real-time operations.

## Product Purpose

An admin dashboard for managing campus shuttle buses ("รถตะลัย") at Kasetsart University Kamphaeng Saen. It facilitates route configuration, station management, vehicle tracking, and administrative access control. Success is defined by secure access, real-time accuracy of the fleet monitor, and intuitive management of complex routing configurations.

## Positioning

A role-based, secure, real-time dashboard dedicated specifically to tracking and managing a university campus transport network via GPS (Leaflet + MQTT) and enforcing strict admin access logic.

## Operating Context

- Real-time environment tracking live GPS coordinates from buses via MQTT.
- Administrators need an equal balance between visualizing the physical location of buses on a map and monitoring tabular data about vehicle status and routes.
- Security-first access with one-time invite links, strict JWT verification, and Redis session management.

## Capabilities and Constraints

- **Capabilities:** 
  - Role-based login (Super Admin vs. Admin).
  - One-time invite links for new admins with 15-minute expiration.
  - Revocation of admin access (Kick-out feature).
  - Route & Station management (add/edit/delete, reorder).
  - Fleet management (active/inactive/maintenance).
  - Static time configuration between stations.
  - Live fleet tracking using Leaflet and MQTT.
- **Constraints:** 
  - Single-use logic for registration keys stored in Redis.
  - Protection against self-deletion for active Super Admins.
  - Admin cannot modify Super Admin permissions.
  - Frontend relies on React Router Protected Routes and Axios interceptors for HTTP-only cookie token refreshes.

## Brand Commitments

No strict university brand guidelines are required (e.g., KU Green is optional). The mandate is a clean, professional, and modern admin dashboard style.

## Evidence on Hand

The existing project configuration indicates:
- React + Vite + Tailwind V4 stack setup.
- Comprehensive `README.md` detailing the system architecture, security flows, and feature lists.
