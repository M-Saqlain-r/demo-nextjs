"use client"

import React from "react"
import Link from "next/link"

type NavCloudItem = {
  title: string
  url: string
  icon: React.ElementType
  isActive?: boolean
  items?: { title: string; url: string }[]
}

export function NavClouds({ items }: { items: NavCloudItem[] }) {
  return (
    <div className="space-y-4 px-3 py-2">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-2">
        Cloud Sections
      </h4>
      {items.map((section) => (
        <div key={section.title} className="space-y-1">
          <Link
            href={section.url}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              section.isActive
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <section.icon className="w-4 h-4" />
            <span className="font-medium">{section.title}</span>
          </Link>
          {section.items?.length && (
            <div className="ml-6 border-l border-gray-200 pl-3 space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="block text-sm text-gray-600 hover:text-gray-900"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
